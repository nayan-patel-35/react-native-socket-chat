import {useEffect, useRef, useState} from 'react';

import {
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MessageListScreen} from 'react-native-socket-chat';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import RBSheetComponent from '../../components/RBSheetComponent';
import AppColors from '../../utils/AppColors';
import {DEVICE_HEIGHT, isEmpty} from '../../utils/AppConstant';
import {
  GetCameraImage,
  GetCameraVideo,
  GetGalleryImage,
  GetGalleryVideo,
} from '../../utils/ImagePicker';
import {checkExternalFilePermission} from '../../utils/LocationServices';
import {selectIsLoggedInUserData} from '../auth/redux/auth';

const ChatMessageListScreen = (props: any) => {
  let item = props?.route?.params?.item;

  // .. selector
  const userData: any = useSelector(selectIsLoggedInUserData);

  // .. ref
  const refSelectPhotoVideoSheetRef: any = useRef(null);
  const refCameraGallerySheetRef: any = useRef(null);

  // .. state
  const [channel, setChannel] = useState<any>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [sendMsgText, setSendMsgText] = useState<string>('');
  const [isPhotoSelected, setIsPhotoSelected] = useState<boolean>(false);
  const [isImageProcessing, setIsImageProcessing] = useState<boolean>(false);
  const [messageList, setMessageList]: any[] = useState([]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, [keyboardHeight]);

  const _keyboardDidShow = (e: any) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const _keyboardDidHide = (e: any) => {
    setKeyboardHeight(0);
  };

  const _onPressAttachment = () => {
    refSelectPhotoVideoSheetRef.current.open();
  };

  const startStopTyping = async type => {
    const data = {
      messageType: 'Chat',
      to: item?._id,
      from: userData?._id,
    };
    await channel.emit(type, data);
  };

  const _onPressSend = () => {
    let toUserId = item?.members?.filter((item: any, index: number) => {
      return item?._id != userData?._id;
    });

    if (!isEmpty(sendMsgText?.toString()?.trim())) {
      const data = {
        content: sendMsgText,
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: toUserId?.[0]?._id,
        sender: userData?._id,
        to: toUserId?.[0]?._id,
        from: userData?._id,
        channelId: item?.channelId,
        type: 'channel',
      };
      channel?.emit('message', data);

      const tempData = {
        content: sendMsgText,
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: toUserId?.[0]?._id,
        sender: {
          _id: userData?._id,
          updatedAt: new Date(),
        },
        to: toUserId?.[0]?._id,
        from: userData?._id,
        channelId: item?.channelId,
        type: 'channel',
      };
      setMessageList(prevMessageList => [...prevMessageList, tempData]);
      setSendMsgText('');
      setTimeout(() => {
        startStopTyping('stop typing');
      }, 100);
    }
  };

  const _onChangeText = (message: string) => {
    setSendMsgText(message);
    if (isEmpty(message?.toString()?.trim())) {
      startStopTyping('start typing');
    } else {
      startStopTyping('stop typing');
    }
  };

  const _onBackPress = () => {
    props?.navigation?.goBack();
  };

  const checkFilePermission = (type: string) => {
    checkExternalFilePermission(
      (grantCamera: any) => {
        if (grantCamera === 'granted') {
          if (type === 'Video') {
            refCameraGallerySheetRef?.current?.open();
            setIsPhotoSelected(false);
          }

          if (type === 'Photo') {
            refCameraGallerySheetRef?.current?.open();
            setIsPhotoSelected(true);
          }
        }
      },
      (denied: any) => {
        if (denied === 'blocked' || denied === 'denied') {
          Alert.alert(
            '',
            Platform.OS == 'android'
              ? 'File and Media access needed. Go to App Settings, tab Permissions, and tap allow.'
              : 'File and Media access needed. tab allow',
            [
              {
                text: 'Deny',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'Allow', onPress: () => openSettings()},
            ],
          );
        }
      },
    );
  };

  const onSelectCameraGallery = (type: string) => {
    if (type === 'TakePhoto') {
      addCameraPhotoVideoHandler();
    }

    if (type === 'Gallery') {
      addGalleryPhotoVideoHandler();
    }
  };

  const addGalleryPhotoVideoHandler = async () => {
    refCameraGallerySheetRef?.current?.close();
    refSelectPhotoVideoSheetRef?.current?.close();
    setTimeout(async () => {
      setIsImageProcessing(true);
      if (isPhotoSelected) {
        GetGalleryImage(
          (image: any) => {
            //  setChatImage([image]);
            //  setViewImageVideo(true);
            //  setIsImageProcessing(false);
          },
          (error: any) => {
            setIsImageProcessing(false);
          },
        );
      } else {
        GetGalleryVideo(
          (video: any) => {
            if (video.size > 52428800) {
              setIsImageProcessing(false);
              Toast.show({
                type: 'error',
                text1: 'Please select video less than 50MBs',
              });
            } else {
              //  setChatImage([video]);
              //  setViewImageVideo(true);
              //  setIsImageProcessing(false);
            }
          },
          (error: any) => {
            setIsImageProcessing(false);
          },
        );
      }
    }, 800);
  };

  const addCameraPhotoVideoHandler = async () => {
    refCameraGallerySheetRef.current.close();
    refSelectPhotoVideoSheetRef?.current?.close();
    setTimeout(async () => {
      setIsImageProcessing(true);
      if (isPhotoSelected) {
        GetCameraImage(
          (image: any) => {
            //  setChatImage([image]);
            //  setViewImageVideo(true);
            //  setIsImageProcessing(false);
          },
          (error: any) => {
            //  setIsImageProcessing(false);
          },
        );
      } else {
        GetCameraVideo(
          (video: any) => {
            if (video.size > 52428800) {
              Toast.show({
                type: 'error',
                text1: 'Please select video less than 50MBs',
              });
            } else {
              //  setChatImage([video]);
              //  setViewImageVideo(true);
              //  setIsImageProcessing(false);
            }
          },
          (error: any) => {
            setIsImageProcessing(false);
          },
        );
      }
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
      <View style={styles.container}>
        <MessageListScreen
          onPressBack={_onBackPress}
          onChangeText={_onChangeText}
        />
      </View>

      <RBSheetComponent
        inputRef={refSelectPhotoVideoSheetRef}
        title={''}
        isChatSelection={true}
        height={DEVICE_HEIGHT / 3.25}
        onPressType={checkFilePermission}>
        <RBSheetComponent
          inputRef={refCameraGallerySheetRef}
          title={''}
          animationType={'none'}
          isChatSelection={false}
          height={DEVICE_HEIGHT / 3.25}
          onPressType={onSelectCameraGallery}
        />
      </RBSheetComponent>
    </SafeAreaView>
  );
};

export default ChatMessageListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  scrollviewContainer: {
    flex: 1,
  },

  keyboardViewStyle: {
    shadowOffset: {
      width: 0,
      height: -1,
    },
    padding: 10,
    shadowRadius: 0,
    shadowOpacity: 1,
    borderTopWidth: 1,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
  },

  attachmentViewStyle: {
    padding: '1%',
  },

  sendMsgViewStyle: {
    flex: 1,
    borderWidth: 1,
    maxHeight: 150,
    overflow: 'hidden',
    borderRadius: 8,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },

  sendMsgTextStyle: {
    height: Platform.OS === 'ios' ? 55.5 : undefined,
    fontSize: 14,
    color: AppColors.black,
    backgroundColor: AppColors.white,
  },

  sendBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
