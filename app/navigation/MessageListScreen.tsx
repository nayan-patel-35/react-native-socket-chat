import moment from 'moment';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  FlatList as FlatListType,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Assets } from '../assets';
import AutoScroll from '../components/AutoScroll';
import NoDataComponent from '../components/NoDataComponent';
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
  generateAvatar,
  isEmpty,
  isIphoneWithNotch,
} from '../utils/AppConstant';

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
  imageData,
  isAttachmentVisible
}: any) => {
  const {state: socketState}: any = useContext(SocketContext);
  const {state: chatState}: any = useContext(ChatContext);

  // .. ref
  const refMembersListRef: any = useRef(null);
  const flatListRef = useRef<FlatListType | null>(null);

  // .. state
  const [channel, setChannel] = useState<any>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [sendMsgText, setSendMsgText] = useState<string>('');

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

  const _onPressMember = () => {
    onPressMember ? onPressMember() : refMembersListRef?.current?.open();
  };

  const _onPressCloseMemberListSheet = () => {
    refMembersListRef?.current?.close();
  };

  const _renderMemberList = () => {
    const data =
      chatMember?.length > 0 ? chatMember : chatState?.selectedChat?.members;

    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.membersListContainerStyle}>
        <View style={styles.avtarHeadImageStyle}>
          <Text style={styles.avtarHeadTextStyle}>
            {generateAvatar(`${item?.firstName ?? ''} ${item?.lastName ?? ''}`)}
          </Text>
        </View>
        <Text style={styles.membersNameTextStyle}>
          {`${item?.firstName ?? ''} ${item?.lastName ?? ''}`}
        </Text>
        <Text style={styles.groupAdminTextStyle}>
          {chatState?.selectedChat?.createdById === item?._id
            ? ` (Group Admin)`
            : ''}
        </Text>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 20}}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeaderComponent
        backImage={backImage}
        onPressBack={onPressBack}
        channelName={channelName ? channelName : renderChannelName()}
        chatMember={
          chatMember && chatMember?.length > 0
            ? chatMember
            : chatState?.selectedChat?.members
          // ?.filter(
          //     (item: any, index: number) => {
          //       return item?._id != socketState?.user?._id;
          //     },
          //   )
        }
        receiverUserData={receiverUserData}
        titleHeadTextPropsStyle={titleHeadTextPropsStyle}
        subTitleTextPropsStyle={subTitleTextPropsStyle}
        backImagePropsStyle={backImagePropsStyle}
        onPressMember={() =>
          chatState?.selectedChat?.channelType === CHANNEL_TYPE.GROUP
            ? _onPressMember()
            : undefined
        }
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
          isAttachmentVisible:isAttachmentVisible,
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

      <RBSheet
        ref={refMembersListRef}
        openDuration={250}
        animationType={'slide'}
        height={DEVICE_HEIGHT / 2}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          container: styles.rbsheetContainerStyle,
        }}>
        <View style={styles.rbSheetSubContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.closeIconStyle}
            onPress={_onPressCloseMemberListSheet}>
            <Image
              source={Assets.close_black_icon}
              style={{width: 25, height: 25}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styles.headTextStyle}>{'Members'}</Text>
          {_renderMemberList()}
        </View>
      </RBSheet>
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

  rbsheetContainerStyle: {
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  rbSheetSubContainer: {flex: 1, marginHorizontal: '5%'},

  closeIconStyle: {
    padding: '1.5%',
    marginTop: 2.5,
    alignItems: 'flex-end',
  },

  headTextStyle: {
    fontSize: 18,
    lineHeight: 18,
    color: AppColors.black,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 2,
  },

  membersListContainerStyle: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  membersNameTextStyle: {
    fontSize: 15,
    color: AppColors.black,
  },

  groupAdminTextStyle: {
    fontSize: 12,
    color: AppColors.dark_gray,
  },

  avtarHeadImageStyle: {
    width: 38,
    height: 38,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: AppColors.border_color,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avtarHeadTextStyle: {
    fontSize: 14,
    color: AppColors.black,
    fontWeight: 'semibold',
  },
});
