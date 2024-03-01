import {useEffect, useRef, useState} from 'react';

import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {Assets} from '../../assets';
import AutoScroll from '../../components/AutoScroll';
import NoDataComponent from '../../components/NoDataComponent';
import RBSheetComponent from '../../components/RBSheetComponent';
import ChatBottomInputComponent from '../../components/chat/ChatBottomInputComponent';
import ChatHeaderComponent from '../../components/chat/ChatHeaderComponent';
import MessageItemComponent from '../../components/chat/MessageItemComponent';
import TypingIndicator from '../../components/chat/TypingIndicatorDot/TypingIndicator';
import {getMessageListRequest} from '../../sharedUtils/services/api';
import AppColors from '../../utils/AppColors';
import {
  DEVICE_HEIGHT,
  isEmpty,
  isIphoneWithNotch,
} from '../../utils/AppConstant';
import {
  GetCameraImage,
  GetCameraVideo,
  GetGalleryImage,
  GetGalleryVideo,
} from '../../utils/ImagePicker';
import {checkExternalFilePermission} from '../../utils/LocationServices';

const ChatMessageListScreen = (props: any) => {
  let item = props?.route?.params?.item;

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

  useEffect(() => {
    if (!isEmpty(global.socketData)) {
      setChannel(global.socketData);

      global.socketData && global.socketData.emit('join chat', item?._id);
      if (global.socketData?.connected) {
        global.socketData.on('start typing', data => {
          setIsTyping(true);
        });
        global.socketData.on('stop typing', data => {
          setIsTyping(false);
        });
      }
      global.socketData.on('message', async data => {
        console.log('data', data);
        let tempMessageList = [...messageList];
        tempMessageList.push({tempMessageList, ...data?.newMsg});
        setMessageList(tempMessageList);
      });
    }
    getMessageListAPICall();
  }, []);

  const getMessageListAPICall = () => {
    getMessageListRequest(item?.channelId)
      .then((response: any) => {
        // console.log('getMessageListRequestRes', JSON.stringify(response));
        if (response?.success) {
          setMessageList(
            response?.data?.length > 0 ? response?.data?.reverse() : [],
          );
        }
      })
      .catch((error: any) => {
        console.log('getMessageListRequestCatch', JSON.stringify(error));
      });
  };

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
      from: global.currentUserData?.data?._id,
    };
    await channel.emit(type, data);
  };

  const _onPressSend = () => {
    if (!isEmpty(sendMsgText?.toString()?.trim())) {
      const data = {
        content: sendMsgText,
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: item?._id,
        sender: global.currentUserData?.data?._id,
        to: item?._id,
        from: global.currentUserData?.data?._id,
        channelId: item?.channelId,
        type: 'channel',
      };
      channel?.emit('message', data);
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
    console.log('Press');
    props?.navigation?.goBack();
  };

  const _renderMessageItem = ({item, index}: any) => {
    return (
      <MessageItemComponent
        toUserId={item?._id}
        fromUserId={global.currentUserData?.data?._id}
        item={item}
        index={index}
      />
    );
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

  const renderChannelName = (item: any, index?: number) => {
    let channelName: string = '';
    if (!isEmpty(item?.channelName)) {
      channelName = item?.channelName;
    }
    if (isEmpty(item?.channelName) && item?.members?.length >= 2) {
      let tempUsers = item?.members?.filter((item: any, index: number) => {
        return item?._id != global.currentUserData?.data?._id;
      });
      channelName =
        tempUsers?.length > 0
          ? `${tempUsers[0]?.firstName} ${tempUsers[0]?.lastName}`
          : '';
    } else {
      channelName = item ? `${item?.firstName} ${item?.lastName}` : '';
    }
    return channelName;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
      <View style={styles.container}>
        <ChatHeaderComponent
          backImage={Assets.arrow_back_black_icon}
          onPressBack={_onBackPress}
          channelName={renderChannelName(item)}
          chatMember={item?.members?.filter((item: any, index: number) => {
            return item?._id != global.currentUserData?.data?._id;
          })}
        />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}>
          {isLoading ? (
            <View style={styles.scrollviewContainer} />
          ) : messageList?.length > 0 ? (
            <AutoScroll
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled>
              <FlatList
                horizontal={false}
                data={messageList}
                renderItem={_renderMessageItem}
                disableVirtualization={true}
                ListFooterComponent={
                  isTyping ? <TypingIndicator isTyping={isTyping} /> : null
                }
                showsVerticalScrollIndicator={false}
              />
            </AutoScroll>
          ) : (
            <NoDataComponent
              image={Assets.no_chat}
              title={'No Chat'}
              subTitle={'No Chat Initiation has occurred'}
            />
          )}
        </View>

        <ChatBottomInputComponent
          // onPressAttachment={_onPressAttachment}
          onPressSend={_onPressSend}
          onChangeText={_onChangeText}
          value={sendMsgText}
          keyboardViewPropsStyle={{
            marginBottom:
              Platform.OS == 'ios'
                ? isIphoneWithNotch()
                  ? keyboardHeight - 20
                  : keyboardHeight + 10
                : 5,
          }}
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
