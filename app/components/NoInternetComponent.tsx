import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Assets} from '../assets';
import AppColors from '../utils/AppColors';
import {DEVICE_HEIGHT, DEVICE_WEIGHT} from '../utils/AppConstant';
import ThemeBtn from './ThemeBtn';

interface NoInternetComponentProps {
  title?: string;
  subTitle?: string;
  btnText?: string;
  btnStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const NoInternetComponent = ({
  title,
  subTitle,
  btnText,
  btnStyle,
  onPress,
  children,
}: NoInternetComponentProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={Assets.no_internet}
        style={{
          width: DEVICE_WEIGHT - 20,
          height: DEVICE_HEIGHT / 2.5,
        }}
        resizeMode={'contain'}
      />
      {title ? (
        <Text style={styles.titleTextStyle}>
          {title ? title : 'No Internet'}
        </Text>
      ) : null}
      {subTitle ? (
        <Text style={styles.subTitleTextStyle}>{subTitle ? subTitle : ''}</Text>
      ) : null}
      {onPress ? (
        <ThemeBtn
          btnText={btnText ?? 'Retry Now'}
          onPress={onPress}
          btnStyle={btnStyle}
        />
      ) : null}
    </View>
  );
};

export default NoInternetComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
  },

  titleTextStyle: {
    fontSize: 20,
    lineHeight: 20,
    color: AppColors.black,
    textAlign: 'center',
    marginVertical: 12,
  },

  subTitleTextStyle: {
    fontSize: 16,
    lineHeight: 16,
    color: AppColors.black,
    textAlign: 'center',
    marginTop: 8,
  },
});
