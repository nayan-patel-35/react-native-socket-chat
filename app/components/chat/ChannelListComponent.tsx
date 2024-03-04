import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import {Assets} from '../../assets';
import AppColors from '../../utils/AppColors';
import {DUMMY_PLACEHOLDER, isEmpty} from '../../utils/AppConstant';
import ChatListComponent from './ChatListComponent';

interface ChannelListComponentProps {
  data: any;
  renderItem?: null | undefined | any;
  headerText?: string;
  titleHeadTextPropsStyle?: StyleProp<TextStyle>;
  horizontal?: boolean;
  onPressLogout?: () => void;
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
  onPressLogout,
  onPress,
}: ChannelListComponentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.chatHeaderViewStyle}>
        <Text style={[styles.titleHeadTextStyle, titleHeadTextPropsStyle]}>
          {headerText ? headerText : 'Chats'}
        </Text>
        <Pressable
          onPress={onPressLogout}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
          <Image style={{width: 20, height: 20}} source={Assets.logout_icon} />
        </Pressable>
      </View>
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

  chatHeaderViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  titleHeadTextStyle: {
    fontSize: 25,
    lineHeight: 25,
    color: AppColors.primary,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    flex: 1,
  },
});
