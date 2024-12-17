import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
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
import Video from 'react-native-video';
import { Assets } from '../../assets';
import RBSheetComponent from '../../components/RBSheetComponent';
import { ChatContext } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';
import AppColors from '../../utils/AppColors';
import {
  CHANNEL_TYPE,
  DEVICE_HEIGHT,
  FILES_TYPES,
  getFileTypeFromUrl,
  isEmpty,
} from '../../utils/AppConstant';
import {
  GetCameraImage,
  GetCameraVideo,
  GetGalleryImage,
  GetGalleryVideo,
  GetImageParams,
} from '../../utils/ImagePicker';
import { checkExternalFilePermission } from '../../utils/LocationServices';

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
    isAttachmentVisible?: boolean;
    attchmentImage?: Image;
    attachmentImagePropsStyle?: StyleProp<ImageStyle>;
    sendImage?: Image;
    sendImagePropsStyle?: StyleProp<ImageStyle>;
    keyboardViewPropsStyle?: StyleProp<ViewStyle>;
    attachmentData?: any;
    attachmentCallbackData: any;
    onPressAttachment?: () => void;
    onPressSend: () => void;
    children?: React.ReactNode;
  };
}

const ChatBottomInputComponent = ({ props }: ChatBottomInputComponentProps) => {
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
    attachmentData,
    attachmentCallbackData,
    onPressAttachment,
    onPressSend,
  } = props;
  const { state: socketState, appendMessages }: any = useContext(SocketContext);
  const { state: chatState }: any = useContext(ChatContext);

  // .. ref
  const refSelectPhotoVideoSheetRef: any = useRef(null);
  const refCameraGallerySheetRef: any = useRef(null);

  console.log('chatState', chatState);
  // .. state
  const [isPhotoSelected, setIsPhotoSelected] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    if (attachmentCallbackData) {
      setFiles(prevFiles => [...prevFiles, attachmentCallbackData]);
    }
  }, [attachmentCallbackData]);

  const _onPressSend = () => {
    onPressSend?.();
    let receiverData = chatState?.selectedChat?.members?.find(
      (item: any) => item?._id != socketState?.user?._id,
    );

    let chatPayload: any = null;
    // For one to one channel
    if (chatState.selectedChat?.channelType === CHANNEL_TYPE.CHAT) {
      chatPayload = {
        content: value,
        sender: socketState?.user?._id,
        messageType: CHANNEL_TYPE.CHAT,
        from: socketState?.user?._id,
      };
    } else {
      // For group channel
      chatPayload = {
        content: value,
        sender: socketState?.user?._id,
        // to: chatState?.selectedChat?.members?.find(
        //   (item: any) => item?._id != socketState?.user?._id,
        // )?._id,
        // from: socketState?.user?._id,
        messageType: CHANNEL_TYPE.GROUP,
        channelId: chatState?.selectedChat?._id || '',
      };
    }

    // Set active channel
    if (chatState?.selectedChat?.channelId) {
      chatPayload.channelId = chatState?.selectedChat?.channelId;
    }

    // Add attachments
    if (files?.length > 0) {
      chatPayload.attachments = files || [];
    }

    console.log('chatPayload', JSON.stringify(chatPayload));
    socketState?.socketClient?.emit('message', chatPayload);

    const tempData = {
      content: value,
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
    return;
    const latestMsg = {
      date: moment(new Date()).format('YYYY-MM-DD'),
      list: [
        {
          channelId: chatState?.selectedChat?.channelId,
          content: value,
          createdAt: new Date(),
          date: moment(new Date()).format('YYYY-MM-DD'),
          sender: {
            _id: socketState?.user?._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            fullName: socketState?.user?.name,
            email: socketState?.user?.email,
          },
          status: 'sent',
          updatedAt: new Date(),
          //  reactions: type === 'Reaction' ? [data?.emoji] : [{}],
        },
      ],
      type: 'channel',
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: moment(new Date()).format('YYYY-MM-DD'),
    };

    if (files?.length > 0) {
      const chatPayload = {
        content: 'Attachment',
        messageType: 'Chat',
        status: 'online',
        // isSystem: false,
        user: receiverData?._id,
        sender: socketState?.user?._id,
        to: receiverData?._id,
        from: socketState?.user?._id,
        attachments: files,
        channelId: chatState?.selectedChat?.channelId,
        type: 'channel',
      };
      console.log('chatPayload', chatPayload);
      socketState?.socketClient?.emit('message', chatPayload);

      const tempData = {
        content: 'Attachment',
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
        attachments: files,
        channelId: chatState?.selectedChat?.channelId,
        type: 'channel',
        createdAt: new Date(),
        updatedAt: new Date(),
        date: moment(new Date()).format('YYYY-MM-DD'),
        _id: moment(new Date()).format('YYYY-MM-DD'),
      };

      setFiles([]);
      setIsPhotoSelected(false);
      appendMessages(tempData);
    }
  };

  const _onChangeText = (e: any) => {
    onChangeText?.(e);
  };

  const _onPressAttachment = () => {
    if (isAttachmentVisible) {
      onPressAttachment?.();
    } else {
      refSelectPhotoVideoSheetRef?.current?.open();
    }
  };

  const checkFilePermission = (type: string) => {
    checkExternalFilePermission(
      (grantCamera: string) => {
        if (grantCamera === 'granted') {
          refCameraGallerySheetRef?.current?.open();
          setIsPhotoSelected(type === 'Photo');
        }
      },
      (denied: string) => {
        if (['blocked', 'denied'].includes(denied)) {
          Alert.alert(
            '',
            Platform.OS === 'android'
              ? 'File and Media access needed. Go to App Settings, tap Permissions, and allow access.'
              : 'File and Media access needed. Tap allow.',
            [
              { text: 'Deny', onPress: () => {}, style: 'cancel' },
              { text: 'Allow', onPress: openSettings },
            ],
          );
        }
      },
    );
  };

  const onSelectCameraGallery = (type: string) => {
    type === 'TakePhoto'
      ? handlePhotoVideoSelection(true)
      : handlePhotoVideoSelection(false);
  };

  const handlePhotoVideoSelection = async (isCamera: boolean) => {
    refCameraGallerySheetRef?.current?.close();
    refSelectPhotoVideoSheetRef?.current?.close();

    setTimeout(async () => {
      const handleSelection = isPhotoSelected
        ? handleImageSelection
        : handleVideoSelection;

      await handleSelection(isCamera);
    }, 800);
  };

  const handleImageSelection = async (isCamera: boolean) => {
    const getImage = isCamera ? GetCameraImage : GetGalleryImage;

    getImage(
      async (image: any) => {
        GetImageParams(
          [image],
          async (imageParam: any) => {
            attachmentData(imageParam);
          },
          () => {},
        );
      },
      () => {},
    );
  };

  const handleVideoSelection = async (isCamera: boolean) => {
    const getVideo = isCamera ? GetCameraVideo : GetGalleryVideo;

    getVideo(
      async (video: any) => {
        if (video.size > 52428800) {
          Toast.show({
            type: 'error',
            text1: 'Please select a video less than 50MB.',
          });
        } else {
          attachmentData(video);
        }
      },
      () => {},
    );
  };

  const handleDeleteFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <View style={[styles.keyboardViewStyle, keyboardViewPropsStyle]}>
        <FlatList
          data={files || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            const fileType = getFileTypeFromUrl(item?.fileUrl);

            const RenderMedia = () => {
              switch (fileType) {
                case FILES_TYPES.JPEG:
                case FILES_TYPES.JPG:
                case FILES_TYPES.PNG:
                  return (
                    <Image
                      source={{ uri: item?.fileUrl }}
                      style={styles.imageViewStyle}
                    />
                  );
                case FILES_TYPES.MP4:
                case FILES_TYPES.MKV:
                  return (
                    <Video
                      repeat
                      muted
                      controls={Platform.OS === 'ios'}
                      resizeMode="cover"
                      source={{ uri: item?.fileUrl }}
                      style={styles.imageViewStyle}
                    />
                  );
                default:
                  return null;
              }
            };

            return (
              <View style={styles.imageMainContainerStyle}>
                <Pressable
                  style={styles.deleteIconViewStyle}
                  onPress={() => handleDeleteFile(index)}>
                  <Image
                    source={Assets.close_black_icon}
                    style={styles.deleteImageStyle}
                  />
                </Pressable>
                <RenderMedia />
              </View>
            );
          }}
        />

        <View style={{ flexDirection: 'row' }}>
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
            style={[
              styles.textInputContainerStyle,
              textInputContainerPropsStyle,
            ]}>
            <TextInput
              value={value}
              onChangeText={_onChangeText}
              placeholderTextColor={
                placeholderTextColor ? placeholderTextColor : 'gray'
              }
              placeholder={placeholder ? placeholder : 'Write your message...'}
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
                : files?.length > 0
                ? false
                : files?.length === 0 && isEmpty(value?.toString()?.trim())
                ? true
                : false
            }>
            <Image
              style={[styles.sendImageStyle, sendImagePropsStyle]}
              source={
                sendImage
                  ? sendImage
                  : (files?.length === 0 &&
                      !isEmpty(value?.toString()?.trim())) ||
                    files?.length > 0
                  ? Assets.send_blue_icon
                  : Assets.send_grey_icon
              }
            />
          </Pressable>
        </View>
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
    </>
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

  imageMainContainerStyle: {
    alignSelf: 'flex-start',
    marginRight: 12.5,
    marginVertical: 10,
  },

  deleteIconViewStyle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    position: 'absolute',
    top: -5,
    right: -7.5,
    zIndex: 1111,
    padding: 2,
  },

  hitSlop: {
    left: 15,
    right: 15,
    top: 15,
    bottom: 15,
  },

  deleteImageStyle: {
    width: 18,
    height: 18,
  },

  imageViewStyle: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
});
