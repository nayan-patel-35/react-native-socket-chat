import React from 'react';
import {Alert, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChannelListScreen} from 'react-native-socket-chat';
import {useSelector} from 'react-redux';
import AppColors from '../../utils/AppColors';
import {isEmpty} from '../../utils/AppConstant';
import {selectSocketClient} from '../auth/redux/auth';
import authenticationapi from '../auth/redux/model/authenticationapi';

const ChannelList = (props: any) => {
  // .. selector
  const socketClient: any = useSelector(selectSocketClient);

  const _onPressLogout = () => {
    Alert.alert('Come back soon!', 'Are you sure you want to Log out ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Log Out',
        onPress: handleLogout,
      },
    ]);
  };

  const handleLogout = async () => {
    let response: any = await authenticationapi.logout();
    if (response?.success) {
      if (!isEmpty(socketClient)) {
        socketClient.disconnect();
        setTimeout(() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen'}],
          });
        }, 500);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
      <ChannelListScreen
        props={{
          headerText: 'Good Morning!',
          onPress: (item: any, index: number) => {
            console.log('onPress_ChannelList', item?._id);
            props?.navigation?.navigate('ChatMessageListScreen');
          },
          horizontal: false,
          onPressLogout: () => _onPressLogout(),
        }}
      />
    </SafeAreaView>
  );
};

export default ChannelList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  titleHeadTextStyle: {
    fontSize: 25,
    lineHeight: 25,
    color: AppColors.primary,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 10,
  },
});
