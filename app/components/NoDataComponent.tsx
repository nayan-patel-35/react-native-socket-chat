import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import AppColors from '../utils/AppColors';
import {DEVICE_HEIGHT, DEVICE_WEIGHT} from '../utils/AppConstant';
import ThemeBtn from './ThemeBtn';

interface NoDataComponentProps {
  image?: Image;
  title?: String;
  subTitle?: String;
  buttonText?: string;
  mainViewPropsStyle?: StyleProp<ViewStyle>;
  titleHeadTextPropsStyle?: StyleProp<TextStyle>;
  subTitleTextPropsStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const NoDataComponent = ({
  image,
  title,
  subTitle,
  buttonText,
  mainViewPropsStyle,
  titleHeadTextPropsStyle,
  subTitleTextPropsStyle,
  onPress,
}: NoDataComponentProps) => {
  return (
    <View style={[styles.mainViewStyle, mainViewPropsStyle]}>
      {image ? (
        <Image
          source={image}
          style={{
            width: DEVICE_WEIGHT - 20,
            height: DEVICE_HEIGHT / 2,
          }}
          resizeMode={'contain'}
        />
      ) : null}
      {title ? (
        <Text style={[styles.titleTextStyle, titleHeadTextPropsStyle]}>
          {title}
        </Text>
      ) : null}
      {subTitle ? (
        <Text style={[styles.subTitleTextStyle, subTitleTextPropsStyle]}>
          {subTitle}
        </Text>
      ) : null}
      {onPress ? (
        <ThemeBtn
          btnText={buttonText ? buttonText : 'Save'}
          btnStyle={styles.buttonStyle}
          onPress={onPress}
        />
      ) : null}
    </View>
  );
};

export default NoDataComponent;

const styles = StyleSheet.create({
  mainViewStyle: {
    width: '100%',
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleTextStyle: {
    fontSize: 18,
    lineHeight: 18,
    marginVertical: '2%',
    color: AppColors.black,
  },

  subTitleTextStyle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: AppColors.dark_gray,
  },

  buttonStyle: {
    marginTop: '3%',
    marginBottom: '3%',
    paddingHorizontal: '10%',
  },
});
