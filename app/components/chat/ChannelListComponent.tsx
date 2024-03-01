import React from 'react';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import {DUMMY_PLACEHOLDER, isEmpty} from '../../utils/AppConstant';
import ChatListComponent from './ChatListComponent';

interface ChannelListComponentProps {
  data: any;
  renderItem?: null | undefined | any;
  headerText?: string;
  titleHeadTextPropsStyle?: StyleProp<TextStyle>;
  horizontal?: boolean;
  onPress?: (item: any, index: number) => void;
}

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

const _renderChatListItem = (item: any, index: number, onPress: any) => {
  return (
    <ChatListComponent
      item={item}
      index={index}
      channelName={renderChannelName(item)}
      channelImage={
        item?.profilePicture ? item?.profilePicture : DUMMY_PLACEHOLDER
      }
      unreadCount={item?.unreadCount ?? 0}
      onPress={onPress}
    />
  );
};

const ChannelListComponent = ({
  data,
  headerText,
  titleHeadTextPropsStyle,
  horizontal,
  onPress,
}: ChannelListComponentProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.titleHeadTextStyle, titleHeadTextPropsStyle]}>
        {headerText ? headerText : 'Chats'}
      </Text>
      <FlatList
        horizontal={horizontal ? horizontal : false}
        data={data?.length > 0 ? data : []}
        renderItem={({item, index}) =>
          _renderChatListItem(item, index, onPress)
        }
        contentContainerStyle={{marginTop: 10, paddingBottom: 30}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChannelListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  titleHeadTextStyle: {
    fontSize: 25,
    lineHeight: 25,
    color: AppColors.primary,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 10,
  },
});
