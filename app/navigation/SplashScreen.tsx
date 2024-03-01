import React, {useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppColors from '../utils/AppColors';
import {isEmpty} from '../utils/AppConstant';

const SplashScreen = (props: any) => {
  useEffect(() => {
    if (!isEmpty(global?.token)) {
      props.navigation.reset({
        index: 0,
        routes: [{name: 'ChannelListScreen'}],
      });
    } else {
      props.navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
});
