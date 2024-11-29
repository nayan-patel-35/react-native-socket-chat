import React, { useContext } from 'react';
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
import { Assets } from '../../assets';
import { SocketContext } from '../../context/SocketContext';
import AppColors from '../../utils/AppColors';
import {
  CHANNEL_TYPE,
  DUMMY_PLACEHOLDER,
  isEmpty,
} from '../../utils/AppConstant';
import ChatListComponent from './ChatListComponent';

interface ChannelListComponentProps {
  props: {
    data?: any[];
    renderItem?: null | undefined | any;
    headerText?: string;
    titleHeadTextPropsStyle?: StyleProp<TextStyle>;
    horizontal?: boolean;
    onPressLogout?: () => void;
    onPress?: (item: any, index: number) => void;
    emptyStateText?: string;
    emptyStateComponent?: React.ReactNode;
  };
}

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
};

type UserData = {
  user: {
    _id: string;
  };
};

type Channel = {
  channelName?: string;
  channelType: string;
  members: Member[];
  firstName?: string;
  lastName?: string;
};

const renderChannelName = (
  item: Channel,
  index?: number,
  userData: UserData,
) => {
  // If a channel name is available, use it
  if (!isEmpty(item?.channelName)) {
    return item?.channelName;
  }

  // If there are multiple members and the channel name is empty, use the first member's name
  if (isEmpty(item?.channelName) && item?.members?.length >= 2) {
    const otherMembers = item?.members?.filter(
      (member: any) => member._id !== userData?.user?._id,
    );
    return otherMembers?.length > 0
      ? `${otherMembers[0]?.firstName} ${otherMembers[0]?.lastName}`
      : '';
  }
  // If it's a group channel, return the channel name if available
  if (item?.channelType === CHANNEL_TYPE.GROUP) {
    return item?.channelName ?? '';
  }

  // For individual channels, return the user's name (first and last)
  return item ? `${item?.firstName ?? ''} ${item?.lastName ?? ''}` : '';
};

const _renderChatListItem = (
  item: any,
  index: number,
  onPress: any,
  socketState: any,
) => {
  const channelName = renderChannelName(item, 0, socketState);
  const channelImage = item?.profilePicture ?? DUMMY_PLACEHOLDER;
  const unreadCount = item?.unreadCount ?? 0;

  return (
    <ChatListComponent
      item={item}
      index={index}
      channelName={channelName}
      channelImage={channelImage}
      unreadCount={unreadCount}
      onPress={onPress}
    />
  );
};

const ChannelListComponent = ({props}: ChannelListComponentProps) => {
  const {state: socketState}: any = useContext(SocketContext);
  const {
    data = [],
    headerText = 'Chats',
    titleHeadTextPropsStyle,
    horizontal = false,
    onPressLogout,
    onPress,
    emptyStateText = 'No channels available',
    emptyStateComponent,
  } = props;

  const _renderEmptyState = () => {
    return (
      emptyStateComponent || (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>{emptyStateText}</Text>
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeaderViewStyle}>
        <Text style={[styles.titleHeadTextStyle, titleHeadTextPropsStyle]}>
          {headerText}
        </Text>
        <Pressable
          onPress={onPressLogout}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
          <Image style={{width: 20, height: 20}} source={Assets.logout_icon} />
        </Pressable>
      </View>

      {data?.length === 0 ? (
        _renderEmptyState() // Show empty state when data is empty
      ) : (
        <FlatList
          horizontal={horizontal}
          data={data}
          renderItem={({item, index}) =>
            _renderChatListItem(item, index, onPress, socketState)
          }
          contentContainerStyle={{marginTop: 10, paddingBottom: 30}}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
  },

  emptyStateText: {
    fontSize: 17,
    color: 'gray',
  },
});
