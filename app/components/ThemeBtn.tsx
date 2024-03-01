import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AppColors from '../utils/AppColors';
import {DEVICE_WEIGHT} from '../utils/AppConstant';

interface baseFilters {
  xml: any;
  width: any;
  height: any;
}

interface ThemeBtnProps {
  disabled?: boolean;
  isLoading?: boolean;
  btnStyle?: StyleProp<ViewStyle>;
  btnTextStyle?: StyleProp<ViewStyle>;
  btnText?: string;
  loaderColor?: string;
  rightImage?: Image;
  rightImagePropsStyle?: StyleProp<ImageStyle>;
  leftImage?: Image;
  leftImagePropsStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const ThemeBtn = ({
  disabled,
  isLoading,
  btnStyle,
  btnTextStyle,
  btnText,
  loaderColor,
  rightImage,
  rightImagePropsStyle,
  leftImage,
  leftImagePropsStyle,
  onPress,
  children,
}: ThemeBtnProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[styles.btnStyle, btnStyle]}
      disabled={isLoading || disabled ? true : false}>
      {isLoading ? (
        <ActivityIndicator
          size={'small'}
          color={loaderColor ?? AppColors.primary}
        />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {leftImage ? (
            <View style={{marginEnd: 5}}>
              <Image
                source={leftImage}
                style={[styles.leftImageStyle, leftImagePropsStyle]}
              />
            </View>
          ) : null}
          <Text style={[styles.btnTextStyle, btnTextStyle]}>
            {btnText ? btnText : 'Submit'}
          </Text>
          {rightImage ? (
            <Image
              source={rightImage}
              style={[styles.rightImageStyle, rightImagePropsStyle]}
            />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ThemeBtn;

const styles = StyleSheet.create({
  leftImageStyle: {width: 20, height: 20},

  rightImageStyle: {width: 20, height: 20},

  btnStyle: {
    width: DEVICE_WEIGHT - 25,
    borderRadius: 8,
    paddingVertical: 15,
    backgroundColor: AppColors.primary,
    alignSelf: 'center',
  },

  btnTextStyle: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: AppColors.white,
  },
});
