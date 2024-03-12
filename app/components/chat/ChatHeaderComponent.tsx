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
var moment = require('moment');
const today = moment().format('YYYY-MM-DD');

interface ChatHeaderComponentProps {
  channelName?: string;
  chatMember?: [];
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
  channelName,
  chatMember,
  receiverUserData,
  titleHeadTextPropsStyle,
  subTitleTextPropsStyle,
  backImage,
  backImagePropsStyle,
  onPressBack,
  onPressMember,
  children,
}: ChatHeaderComponentProps) => {
  return (
    <>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <View style={styles.headerViewStyle}>
        <Pressable onPress={onPressBack} style={styles.backBtnViewStyle}>
          <Image
            style={[styles.backImageStyle, backImagePropsStyle]}
            source={backImage ? backImage : Assets.arrow_back_black_icon}
          />
        </Pressable>
        <Pressable
          style={{flex: Platform.OS == 'ios' ? 8 : 2}}
          onPress={onPressMember}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'flex-start',
            }}>
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text
                style={[styles.titleHeadTextStyle, titleHeadTextPropsStyle]}>
                {channelName ? channelName : ''}
              </Text>

              {chatMember?.length != 0 && chatMember != undefined ? (
                <Text
                  style={[styles.subTitleTextStyle, subTitleTextPropsStyle]}>
                  {chatMember?.length}
                  {` ${chatMember?.length > 1 ? 'Members' : 'Member'}`}
                </Text>
              ) : (
                <Text style={styles.subTitleTextStyle}>
                  {receiverUserData?.[0]?.user?.online ? (
                    'Online'
                  ) : (
                    <Text>
                      Last seen on
                      {moment(receiverUserData?.[0]?.user?.last_active).format(
                        'YYYY-MM-DD',
                      ) == today
                        ? moment(
                            receiverUserData?.[0]?.user?.last_active,
                          ).format(' hh:mm A')
                        : moment(
                            receiverUserData?.[0]?.user?.last_active,
                          ).format(' DD MMM')}
                    </Text>
                  )}
                </Text>
              )}
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
});
