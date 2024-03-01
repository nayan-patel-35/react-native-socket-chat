import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {Assets} from '../assets';
import AppColors from '../utils/AppColors';

interface ThemeHeaderProps {
  headerText?: string;
  leftImage: Image;
  rightImage: Image;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  headerPropsViewStyle?: StyleProp<ViewProps>;
  headerPropsTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewProps>;
}

const ThemeHeader = ({
  headerText,
  leftImage,
  rightImage,
  onLeftIconPress,
  onRightIconPress,
  headerPropsViewStyle,
  headerPropsTextStyle,
  containerStyle,
}: ThemeHeaderProps) => {
  return (
    <View
      style={{
        paddingBottom: 10,
      }}>
      <View
        style={[
          containerStyle,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: '1.5%',
          },
        ]}>
        <View>
          {leftImage ? (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.leftIconViewStyle}
              onPress={onLeftIconPress}
              hitSlop={{right: 20, left: 20, bottom: 20, top: 20}}>
              <Image
                source={leftImage ? leftImage : Assets.arrow_back_black_icon}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.leftIconViewStyle} />
          )}
        </View>

        <View style={[styles.headerPropsViewStyle, headerPropsViewStyle]}>
          {headerText ? (
            <Text
              numberOfLines={2}
              style={[styles.headerTextStyle, headerPropsTextStyle]}>
              {headerText}
            </Text>
          ) : null}
        </View>

        <View>
          {rightImage ? (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.rightIconViewStyle}
              onPress={onRightIconPress}>
              <Image
                source={rightImage ? rightImage : Assets.arrow_back_black_icon}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          ) : (
            <View style={[styles.rightIconViewStyle, {width: 45}]} />
          )}
        </View>
      </View>
    </View>
  );
};

export default ThemeHeader;

const styles = StyleSheet.create({
  mainViewStyle: {
    padding: 10,
  },

  leftIconViewStyle: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },

  rightIconViewStyle: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },

  headerPropsViewStyle: {
    flex: 1,
  },

  headerTextStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: AppColors.black,
  },

  rightTextContainerStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginRight: '4%',
  },

  onOffContainerStyle: {
    backgroundColor: AppColors.primary,
    borderRadius: 5,
    alignSelf: 'center',
    paddingVertical: '2%',
    paddingHorizontal: '3%',
  },

  onOffTextStyle: {
    fontSize: 13,
    lineHeight: 13,
    color: AppColors.white,
    textTransform: 'uppercase',
  },

  autoPayTextStyle: {
    fontSize: 16,
    lineHeight: 16,
    color: AppColors.black,
    marginRight: '2%',
  },

  rightTextStyle: {
    fontSize: 13,
    textAlign: 'center',
    color: AppColors.black,
    marginRight: '5%',
  },
});
