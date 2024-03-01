import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppColors from '../utils/AppColors';
import ThemeHeader from './ThemeHeader';

const BaseContainer = (props: any) => {
  return (
    <>
      <SafeAreaView
        forceInset={{top: 'always'}}
        style={[styles.safe1ViewStyle, props.safe1ViewPropsStyle]}
      />
      <SafeAreaView
        forceInset={{top: 'never'}}
        style={[styles.safeViewStyle, props.safeViewPropsStyle]}>
        <View style={styles.flex}>
          <StatusBar
            translucent={true}
            barStyle={props.barPropsStyle ?? 'light-content'}
            backgroundColor={props.barBackgroundColor ?? 'transparent'}
          />
          {props.isNoHeader ? null : (
            <ThemeHeader
              noShadow={props.noShadow}
              leftIcon={props.leftIcon}
              rightIcon={props.rightIcon}
              headerText={props.headerText}
              screenName={props.screenName}
              isNoLeftIcon={props.isNoLeftIcon}
              isNoRightIcon={props.isNoRightIcon}
              rightIconWidth={props?.rightIconWidth}
              onLeftIconPress={props.onLeftIconPress}
              rightIconHeight={props?.rightIconHeight}
              onRightIconPress={props.onRightIconPress}
              headerPropsTextStyle={props.headerPropsTextStyle}
            />
          )}
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default BaseContainer;
const styles = StyleSheet.create({
  safe1ViewStyle: {
    flex: 0,
    backgroundColor: AppColors.primary,
  },

  safeViewStyle: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  flex: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
});
