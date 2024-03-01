import moment from 'moment';
import React, {useLayoutEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import AppColors from '../../utils/AppColors';
import {
  CHAT_MESSAGE_STRING_TYPE,
  CHAT_MESSAGE_TYPE,
  DEVICE_WEIGHT,
  DUMMY_PLACEHOLDER,
} from '../../utils/AppConstant';
const today = moment().format('YYYY-MM-DD');

const {ATTACHMENT_FILE, ATTACHMENT_VIDEO, ATTACHMENT_IMAGE} = CHAT_MESSAGE_TYPE;
const {Image_Type, Video_Type, File_Type} = CHAT_MESSAGE_STRING_TYPE;

interface ChatListComponentProps {
  item: any;
  index: number;
  channelName?: string;
  channelImage?: string;
  unreadCount?: any;
  onPress: (item: any, index: number) => void;
  children?: React.ReactNode;
}
const ChatListComponent = ({
  item,
  index,
  channelName,
  channelImage,
  unreadCount,
  onPress,
  children,
}: ChatListComponentProps) => {
  useLayoutEffect(() => {
    renderLastMessage();
  }, []);

  const renderLastMessage = () => {
    let lastMessage = '';
    let lastMessageText = item?.messages?.[item?.messages?.length - 1]?.text;
    lastMessage =
      lastMessageText == ATTACHMENT_IMAGE
        ? Image_Type
        : lastMessageText == ATTACHMENT_VIDEO
        ? Video_Type
        : lastMessageText == ATTACHMENT_FILE
        ? File_Type
        : lastMessageText;

    return lastMessage;
  };

  return (
    <Pressable
      style={styles.chatCardListItemContainerStyle}
      onPress={() => onPress(item, index)}>
      <Image
        style={styles.avtarImageStyle}
        source={{
          uri: channelImage ? channelImage : DUMMY_PLACEHOLDER,
        }}
        resizeMode={'contain'}
      />
      <View style={styles.chatCardListSubContainerStyle}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={styles.channelNameTextStyle} numberOfLines={1}>
            {channelName}
          </Text>
          <Text style={styles.timeTextStyle} numberOfLines={1}>
            {item?.updatedAt
              ? moment(item?.updatedAt).format('YYYY-MM-DD') == today
                ? moment(item?.updatedAt).format('hh:mm A')
                : moment(item?.updatedAt).format('DD MMM')
              : ''}
          </Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={styles.channelMsgSubTextStyle} numberOfLines={1}>
            {item?.latestMessage ? item?.latestMessage : ''}
          </Text>
          {unreadCount > 0 ? (
            <View style={styles.unreadCountViewStyle}>
              <Text style={styles.unreadCountTextStyle}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatListComponent;

const styles = StyleSheet.create({
  avtarImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },

  chatCardListItemContainerStyle: {
    backgroundColor: AppColors.white,
    width: DEVICE_WEIGHT - 20,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.border_color,
  },

  chatCardListSubContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },

  channelNameTextStyle: {
    fontSize: 16,
    lineHeight: 25,
    color: AppColors.black,
    flex: 1,
  },

  channelMsgSubTextStyle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: AppColors.dark_gray,
  },

  timeTextStyle: {
    fontSize: 12,
    lineHeight: 25,
    color: AppColors.dark_gray,
    alignSelf: 'center',
  },

  unreadCountViewStyle: {
    width: 18,
    height: 18,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },

  unreadCountTextStyle: {
    fontSize: 12,
    lineHeight: 14,
    color: AppColors.white,
  },
});
