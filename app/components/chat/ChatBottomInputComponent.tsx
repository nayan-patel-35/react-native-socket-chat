import moment from 'moment';
import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { openSettings } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import { Assets } from '../../assets';
import RBSheetComponent from '../../components/RBSheetComponent';
import { ChatContext } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';
import AppColors from '../../utils/AppColors';
import { DEVICE_HEIGHT, isEmpty } from '../../utils/AppConstant';
import {
  GetCameraVideo,
  GetGalleryImage,
  GetGalleryVideo,
  GetImageParams,
} from '../../utils/ImagePicker';
import { checkExternalFilePermission } from '../../utils/LocationServices';
import { uploadImage } from '../../utils/UploadImage';

interface ChatBottomInputComponentProps {
  props: {
    value: string | undefined;
    onChangeText: ((text: string) => void) | undefined;
    textInputProps?: TextInputProps;
    disabled?: boolean;
    placeholderTextColor?: string;
    placeholder?: string;
    textInputContainerPropsStyle?: StyleProp<ViewStyle>;
    textInputPropsStyle?: StyleProp<TextStyle>;
    isAttachmentVisible?:boolean;
    attchmentImage?: Image;
    attachmentImagePropsStyle?: StyleProp<ImageStyle>;
    sendImage?: Image;
    sendImagePropsStyle?: StyleProp<ImageStyle>;
    keyboardViewPropsStyle?: StyleProp<ViewStyle>;
    imageData?: any;
    onPressAttachment?: () => void;
    onPressSend: () => void;
    children?: React.ReactNode;
  };
}

const ChatBottomInputComponent = ({props}: ChatBottomInputComponentProps) => {
  const {
    value,
    onChangeText,
    textInputProps,
    disabled = false,
    placeholderTextColor,
    placeholder,
    textInputContainerPropsStyle,
    textInputPropsStyle,
    isAttachmentVisible,
    attchmentImage,
    attachmentImagePropsStyle,
    sendImage,
    sendImagePropsStyle,
    keyboardViewPropsStyle,
    imageData,
    onPressAttachment,
    onPressSend,
  } = props;
  const {state: socketState, appendMessages}: any = useContext(SocketContext);
  const {state: chatState}: any = useContext(ChatContext);

  // .. ref
  const refSelectPhotoVideoSheetRef: any = useRef(null);
  const refCameraGallerySheetRef: any = useRef(null);

  // .. state
  const [isPhotoSelected, setIsPhotoSelected] = useState<boolean>(false);
  const [isImageProcessing, setIsImageProcessing] = useState<boolean>(false);

  const _onPressSend = () => {
    onPressSend?.();
    let receiverData = chatState?.selectedChat?.members?.find(
      (item: any) => item?._id != socketState?.user?._id,
    );

    if (!isEmpty(value?.toString()?.trim())) {
      const chatPayload = {
        content: value,
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: receiverData?._id,
        sender: socketState?.user?._id,
        to: receiverData?._id,
        from: socketState?.user?._id,
        channelId: chatState?.selectedChat?.channelId,
        type: 'channel',
      };
      socketState?.socketClient?.emit('message', chatPayload);

      const tempData = {
        content: value,
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: receiverData?._id,
        to: receiverData?._id,
        from: socketState?.user?._id,
        sender: {
          _id: socketState?.user?._id,
          createdAt: new Date(),
          updatedAt: new Date(),
          fullName: socketState?.user?.name,
          email: socketState?.user?.email,
        },
        channelId: chatState?.selectedChat?.channelId,
        type: 'channel',
        createdAt: new Date(),
        updatedAt: new Date(),
        date: moment(new Date()).format('YYYY-MM-DD'),
        _id: moment(new Date()).format('YYYY-MM-DD'),
      };

      appendMessages(tempData);
    }
  };

  const _onChangeText = (e: any) => {
    onChangeText?.(e);
  };

  const _onPressAttachment = () => {
    if (isAttachmentVisible) {
      console.log('IF',);
      onPressAttachment?.();
    } else {
      console.log('ELSE',);
      refSelectPhotoVideoSheetRef?.current?.open();
    }
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
          async (image: any) => {
            setTimeout(() => {
              setIsImageProcessing?.(true);
            }, 800);
            GetImageParams(
              [image],
              async (imageParam: any) => {
                let response: any = await uploadImage(imageParam);
                console.log('response', JSON.stringify(response));
                if (response?.success) {
                  imageData?.({
                    ...imageParam,
                    imageData: response?.data?.[0],
                    url: response?.data?.[0]?.fileUrl,
                  });
                  setTimeout(() => {
                    setIsImageProcessing?.(false);
                  }, 1000);
                } else {
                  setTimeout(() => {
                    setIsImageProcessing?.(false);
                  }, 1000);
                }
              },
              (error: any) => {
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              },
            );
          },
          (error: any) => {
            setTimeout(() => {
              setIsImageProcessing?.(false);
            }, 1000);
          },
        );
      } else {
        GetGalleryVideo(
          async (video: any) => {
            if (video.size > 52428800) {
              setIsImageProcessing(false);
              Toast.show({
                type: 'error',
                text1: 'Please select video less than 50MBs',
              });
            } else {
              let response: any = await uploadImage(video);
              if (response?.success) {
                imageData?.({
                  ...video,
                  imageData: response?.data?.[0],
                  url: response?.data?.[0]?.fileUrl,
                });
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              } else {
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              }
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
    refCameraGallerySheetRef?.current?.close();
    refSelectPhotoVideoSheetRef?.current?.close();
    setTimeout(async () => {
      setIsImageProcessing(true);
      if (isPhotoSelected) {
        GetGalleryImage(
          async (image: any) => {
            setTimeout(() => {
              setIsImageProcessing?.(true);
            }, 800);
            GetImageParams(
              [image],
              async (imageParam: any) => {
                let response: any = await uploadImage(imageParam);
                console.log('response', JSON.stringify(response));
                if (response?.success) {
                  imageData?.({
                    ...imageParam,
                    imageData: response?.data?.[0],
                    url: response?.data?.[0]?.fileUrl,
                  });
                  setTimeout(() => {
                    setIsImageProcessing?.(false);
                  }, 1000);
                } else {
                  setTimeout(() => {
                    setIsImageProcessing?.(false);
                  }, 1000);
                }
              },
              (error: any) => {
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              },
            );
          },
          (error: any) => {
            setTimeout(() => {
              setIsImageProcessing?.(false);
            }, 1000);
          },
        );
      } else {
        GetCameraVideo(
          async (video: any) => {
            if (video.size > 52428800) {
              Toast.show({
                type: 'error',
                text1: 'Please select video less than 50MBs',
              });
            } else {
              let response: any = await uploadImage(video);
              if (response?.success) {
                imageData?.({
                  ...video,
                  imageData: response?.data?.[0],
                  url: response?.data?.[0]?.fileUrl,
                });
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              } else {
                setTimeout(() => {
                  setIsImageProcessing?.(false);
                }, 1000);
              }
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
    <View style={[styles.keyboardViewStyle, keyboardViewPropsStyle]}>
      {isAttachmentVisible ? (
        <Pressable
          onPress={_onPressAttachment}
          style={styles.attachmentViewStyle}>
          <Image
            style={[styles.attachmentImageStyle, attachmentImagePropsStyle]}
            source={
              attchmentImage ? attchmentImage : Assets.attachment_blue_icon
            }
          />
        </Pressable>
      ) : null}
      <View
        style={[styles.textInputContainerStyle, textInputContainerPropsStyle]}>
        <TextInput
          value={value}
          onChangeText={_onChangeText}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : 'gray'
          }
          placeholder={placeholder ? placeholder : 'Type your message...'}
          style={[styles.textInputStyle, textInputPropsStyle]}
          {...textInputProps}
        />
      </View>
      <Pressable
        onPress={_onPressSend}
        style={styles.sendBtnStyle}
        disabled={
          disabled
            ? disabled
            : isEmpty(value?.toString()?.trim())
            ? true
            : false
        }>
        <Image
          style={[styles.sendImageStyle, sendImagePropsStyle]}
          source={
            sendImage
              ? sendImage
              : !isEmpty(value?.toString()?.trim())
              ? Assets.send_blue_icon
              : Assets.send_grey_icon
          }
        />
      </Pressable>

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
    </View>
  );
};

export default ChatBottomInputComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
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
    borderTopColor: AppColors.border_color,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
  },

  attachmentViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  textInputContainerStyle: {
    flex: 1,
    maxHeight: 150,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: AppColors.border_color,
    marginHorizontal: 8,
    marginTop: 5,
    paddingHorizontal: 10,
  },

  textInputStyle: {
    height: Platform.OS === 'ios' ? 55.5 : undefined,
    fontSize: 15,
    color: AppColors.black,
    backgroundColor: AppColors.white,
  },

  attachmentImageStyle: {
    width: 20,
    height: 20,
  },

  sendBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 100,
  },

  sendImageStyle: {
    width: 25,
    height: 25,
  },
});
