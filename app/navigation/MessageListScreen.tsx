import moment from 'moment';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  FlatList as FlatListType,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { openSettings } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import { Assets } from '../assets';
import AutoScroll from '../components/AutoScroll';
import NoDataComponent from '../components/NoDataComponent';
import RBSheetComponent from '../components/RBSheetComponent';
import ChatBottomInputComponent from '../components/chat/ChatBottomInputComponent';
import ChatHeaderComponent from '../components/chat/ChatHeaderComponent';
import MessageItemComponent from '../components/chat/MessageItemComponent';
import TypingIndicator from '../components/chat/TypingIndicatorDot/TypingIndicator';
import { ChatContext } from '../context/ChatContext';
import { SocketContext } from '../context/SocketContext';
import AppColors from '../utils/AppColors';
import {
  CHANNEL_TYPE,
  DEVICE_HEIGHT,
  isEmpty,
  isIphoneWithNotch,
} from '../utils/AppConstant';
import {
  GetCameraImage,
  GetCameraVideo,
  GetGalleryImage,
  GetGalleryVideo,
} from '../utils/ImagePicker';
import { checkExternalFilePermission } from '../utils/LocationServices';

export const MessageListScreen = ({
  channelName,
  chatMember,
  receiverUserData,
  titleHeadTextPropsStyle,
  subTitleTextPropsStyle,
  backImage,
  backImagePropsStyle,
  onPressBack,
  onPressMember,
  value,
  onChangeText,
  textInputProps,
  disabled,
  placeholderTextColor,
  placeholder,
  textInputContainerPropsStyle,
  textInputPropsStyle,
  attchmentImage,
  attachmentImagePropsStyle,
  sendImage,
  sendImagePropsStyle,
  keyboardViewPropsStyle,
  hideStickyDateHeader,
  onPressAttachment,
  onPressSend,
  additionalFlatListProps,
  listContainer,
  contentContainer,
}: any) => {
  const {state: socketState}: any = useContext(SocketContext);
  const {state: chatState}: any = useContext(ChatContext);

  // .. ref
  const flatListRef = useRef<FlatListType | null>(null);
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

  const [stickyHeaderDate, setStickyHeaderDate] = useState<Date | undefined>(
    new Date(),
  );
  const stickyHeaderDateRef = useRef<Date | undefined>();

  /**
   * We want to call onEndReached and onStartReached only once, per content length.
   * We keep track of calls to these functions per content length, with following trackers.
   */
  const onStartReachedTracker = useRef<Record<number, boolean>>({});
  const onEndReachedTracker = useRef<Record<number, boolean>>({});

  const onStartReachedInPromise = useRef<Promise<void> | null>(null);
  const onEndReachedInPromise = useRef<Promise<void> | null>(null);

  const initialScrollSet = useRef<boolean>(false);
  const channelResyncScrollSet = useRef<boolean>(true);

  const refCallback = (ref: FlatListType) => {
    flatListRef.current = ref;
  };

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
    refSelectPhotoVideoSheetRef?.current?.open();
  };

  const startStopTyping = async type => {
    const data = {
      messageType: 'Chat',
      to: chatState?.selectedChat?._id,
      from: socketState?.user?._id,
    };
    await channel.emit(type, data);
  };

  const _onPressSend = () => {
    setSendMsgText('');
  };

  const _onChangeText = (message: string) => {
    setSendMsgText(message);
    if (isEmpty(message?.toString()?.trim())) {
      startStopTyping('start typing');
    } else {
      startStopTyping('stop typing');
    }
  };

  const _renderMessageItem = ({item, mainIndex}: any) => {
    return item?.list?.map((subItem: any, subIndex: number) => {
      return (
        <MessageItemComponent
          props={{
            item: subItem,
            index: subIndex,
            date: item?.date,
          }}
        />
      );
    });
  };

  const keyExtractor = (item: any) =>
    item._id ||
    (item.createdAt
      ? typeof item.createdAt === 'string'
        ? item.createdAt
        : item.createdAt.toISOString()
      : Date.now().toString());

  const flatListViewabilityConfig = {
    viewAreaCoveragePercentThreshold: 1,
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
    refCameraGallerySheetRef?.current?.close();
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

  const renderChannelName = () => {
    // If a channel name is available, use it
    if (!isEmpty(chatState?.selectedChat?.channelName)) {
      return chatState?.selectedChat?.channelName;
    }

    // If there are multiple members and the channel name is empty, use the first member's name
    if (
      isEmpty(chatState?.selectedChat?.channelName) &&
      chatState?.selectedChat?.members?.length >= 2
    ) {
      const otherMembers = chatState?.selectedChat?.members?.filter(
        (member: any) => member._id !== socketState?.user?._id,
      );
      return otherMembers?.length > 0
        ? `${otherMembers[0]?.firstName} ${otherMembers[0]?.lastName}`
        : '';
    }
    // If it's a group channel, return the channel name if available
    if (chatState?.selectedChat?.channelType === CHANNEL_TYPE.GROUP) {
      return chatState?.selectedChat?.channelName ?? '';
    }

    // For individual channels, return the user's name (first and last)
    return chatState?.selectedChat
      ? `${chatState?.selectedChat?.firstName ?? ''} ${
          chatState?.selectedChat?.lastName ?? ''
        }`
      : '';
  };

  // .. default date format
  const stickyHeaderFormatDate =
    stickyHeaderDate?.getFullYear() === new Date().getFullYear()
      ? 'MMM D'
      : 'MMM D, YYYY';

  const tStickyHeaderDate =
    stickyHeaderDate && !hideStickyDateHeader ? stickyHeaderDate : null;
  const stickyHeaderDateToRender =
    tStickyHeaderDate === null || hideStickyDateHeader
      ? null
      : moment(tStickyHeaderDate).format(stickyHeaderFormatDate);

  return (
    <View style={styles.container}>
      <ChatHeaderComponent
        backImage={backImage}
        onPressBack={onPressBack}
        channelName={channelName ? channelName : renderChannelName()}
        chatMember={
          chatMember && chatMember?.length > 0
            ? chatMember
            : chatState?.selectedChat?.members?.filter(
                (item: any, index: number) => {
                  return item?._id != socketState?.user?._id;
                },
              )
        }
        receiverUserData={receiverUserData}
        titleHeadTextPropsStyle={titleHeadTextPropsStyle}
        subTitleTextPropsStyle={subTitleTextPropsStyle}
        backImagePropsStyle={backImagePropsStyle}
        onPressMember={onPressMember}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
        }}>
        {isLoading ? (
          <View style={styles.scrollviewContainer} />
        ) : socketState?.channelsMessagesList?.length > 0 ? (
          <AutoScroll showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <FlatList
              ref={refCallback}
              contentContainerStyle={[
                styles.contentContainer,
                contentContainer,
              ]}
              horizontal={false}
              keyboardShouldPersistTaps="handled"
              keyExtractor={keyExtractor}
              data={
                socketState?.channelsMessagesList?.length > 0
                  ? socketState?.channelsMessagesList
                  : []
              }
              renderItem={_renderMessageItem}
              disableVirtualization={true}
              ListFooterComponent={
                isTyping ? <TypingIndicator isTyping={isTyping} /> : null
              }
              style={[styles.listContainer, listContainer]}
              testID="message-flat-list"
              showsVerticalScrollIndicator={false}
              viewabilityConfig={flatListViewabilityConfig}
              {...additionalFlatListProps}
            />

            {/* <View style={styles.stickyHeader}>
                  <DateHeader dateString={stickyHeaderDateToRender} />
                </View> */}
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
        props={{
          value: sendMsgText,
          onChangeText: _onChangeText,
          textInputProps: textInputProps,
          disabled: disabled,
          placeholderTextColor: placeholderTextColor,
          placeholder: placeholder,
          textInputContainerPropsStyle: textInputContainerPropsStyle,
          textInputPropsStyle: textInputPropsStyle,
          attchmentImage: attchmentImage,
          attachmentImagePropsStyle: attachmentImagePropsStyle,
          sendImage: sendImage,
          sendImagePropsStyle: sendImagePropsStyle,
          keyboardViewPropsStyle: [
            keyboardViewPropsStyle,
            {
              marginBottom:
                Platform.OS == 'ios'
                  ? isIphoneWithNotch()
                    ? keyboardHeight - 15
                    : keyboardHeight + 10
                  : 5,
            },
          ],
          onPressAttachment: onPressAttachment,
          onPressSend: _onPressSend,
        }}
      />

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

  stickyHeader: {
    position: 'absolute',
    top: 0,
  },

  listContainer: {
    flex: 1,
    width: '100%',
  },

  contentContainer: {
    flexGrow: 1,
    paddingBottom: 4,
  },
});
