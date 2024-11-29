import moment from 'moment';
import React from 'react';
import {
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { Assets } from '../../assets';
import AppColors from '../../utils/AppColors';
import { generateAvatar } from '../../utils/AppConstant';
const today = moment().format('YYYY-MM-DD');

interface ChatHeaderComponentProps {
  channelName?: string;
  chatMember?: any[];
  receiverUserData?: any;
  titleHeadTextPropsStyle?: StyleProp<TextStyle>;
  subTitleTextPropsStyle?: StyleProp<TextStyle>;
  backImage?: Image;
  backImagePropsStyle?: StyleProp<ImageStyle>;
  onPressBack: () => void;
  onPressMember?: () => void;
  children?: React.ReactNode;
}

const ChatHeaderComponent = ({
  channelName = '',
  chatMember = [],
  receiverUserData,
  titleHeadTextPropsStyle,
  subTitleTextPropsStyle,
  backImage,
  backImagePropsStyle,
  onPressBack,
  onPressMember,
  children,
}: ChatHeaderComponentProps) => {
  const lastActiveTime = receiverUserData?.[0]?.user?.last_active;
  const isOnline = receiverUserData?.[0]?.user?.online;

  const renderSubtitle = () => {
    if (chatMember?.length > 0) {
      return (
        <Text style={[styles.subTitleTextStyle, subTitleTextPropsStyle]}>
          {chatMember.length} {chatMember.length > 1 ? 'Members' : 'Member'}
        </Text>
      );
    }

    if (isOnline) {
      return <Text style={styles.subTitleTextStyle}>Online</Text>;
    }

    const formattedTime = moment(lastActiveTime).format(
      moment(lastActiveTime).isSame(today, 'day') ? 'hh:mm A' : 'DD MMM',
    );

    return (
      <Text style={styles.subTitleTextStyle}>Last seen on {formattedTime}</Text>
    );
  };

  {
    console.log('channelName', JSON.stringify(channelName));
  }

  return (
    <>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <View style={styles.headerViewStyle}>
        <Pressable onPress={onPressBack} style={styles.backBtnViewStyle}>
          <Image
            style={[styles.backImageStyle, backImagePropsStyle]}
            source={backImage || Assets.arrow_back_black_icon}
          />
        </Pressable>

        <View style={styles.avtarHeadImageStyle}>
          <Text style={styles.avtarHeadTextStyle}>
            {generateAvatar(channelName)}
          </Text>
        </View>

        <Pressable
          style={{flex: Platform.OS == 'ios' ? 8 : 2}}
          onPress={onPressMember}>
          <View style={styles.memberInfoContainer}>
            <View style={styles.textContainer}>
              <Text
                style={[styles.titleHeadTextStyle, titleHeadTextPropsStyle]}>
                {channelName ? channelName : ''}
              </Text>
              {renderSubtitle()}
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default ChatHeaderComponent;

const styles = StyleSheet.create({
  headerViewStyle: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: AppColors.white,
    paddingVertical: '1.5%',
    borderBottomWidth: 0,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0,
    elevation: 0,
    alignItems: 'center',
  },

  backBtnViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  backImageStyle: {
    width: 20,
    height: 20,
  },

  avtarImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },

  isActiveViewStyle: {
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 10,
    position: 'absolute',
  },

  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },

  memberInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  titleHeadTextStyle: {
    fontSize: 18,
    lineHeight: 25,
    color: AppColors.black,
  },

  subTitleTextStyle: {
    fontSize: 12,
    lineHeight: 20,
    color: AppColors.dark_gray,
  },

  avtarHeadImageStyle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: AppColors.border_color,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avtarHeadTextStyle: {
    fontSize: 17,
    color: AppColors.black,
    fontWeight: 'semibold',
  },
});
