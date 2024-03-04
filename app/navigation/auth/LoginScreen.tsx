import React, {useState} from 'react';
import {Keyboard, ScrollView, StatusBar, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {io} from 'socket.io-client';
import LoadingComponent from '../../components/LoadingComponent';
import ThemeBtn from '../../components/ThemeBtn';
import ThemeTextInput from '../../components/ThemeTextInput';
import {
  getTokenRequest,
  isLoggedInRequest,
  loginRequest,
} from '../../sharedUtils/services/api';
import AppColors from '../../utils/AppColors';
import {isEmpty} from '../../utils/AppConstant';

const CLIENT_ID: string | any = Config.CLIENT_ID;
const SOCKET_BASE_URL: string | any = Config.SOCKET_BASE_URL;

const LoginScreen = (props: any) => {
  // .. state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [email, setEmail] = useState<string>('jack@mailinator.com');
  // const [password, setPassword] = useState<string>('Jack123!@#');

  const _onPressLogin = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    loginRequest(email, password)
      .then((response: any) => {
        console.log('loginRequestRes', JSON.stringify(response));
        if (response?.success) {
          Toast.show({
            type: 'success',
            text1: response?.message,
          });
          isLoggedInRequest()
            .then(async (responseIsLoggedIn: any) => {
              console.log(
                'responseIsLoggedInRes',
                responseIsLoggedIn?.data?._id,
                responseIsLoggedIn?.data?.name,
                responseIsLoggedIn?.data?.email,
              );
              if (responseIsLoggedIn?.success) {
                global.currentUserData = responseIsLoggedIn;
                getTokenRequest(responseIsLoggedIn?.data?._id, CLIENT_ID)
                  .then((responseToken: any) => {
                    setIsLoading(true);
                    console.log(
                      'responseTokenRes',
                      JSON.stringify(responseToken),
                    );
                    if (responseToken?.success) {
                      global.token = responseToken?.data;
                      console.log('TOKEN', responseToken?.data);
                      socketConnectionRequest(responseToken?.data);
                    } else {
                      setIsLoading(false);
                      Toast.show({
                        type: 'error',
                        text1: responseToken?.message,
                      });
                    }
                  })
                  .catch((error: any) => {
                    setIsLoading(false);
                    console.log('responseTokenResCatch', JSON.stringify(error));
                    Toast.show({
                      type: 'error',
                      text1: 'Something went wrong!',
                    });
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              } else {
                setIsLoading(false);
                Toast.show({
                  type: 'error',
                  text1: responseIsLoggedIn?.message,
                });
              }
            })
            .catch((error: any) => {
              setIsLoading(false);
              console.log('responseIsLoggedInResCatch', JSON.stringify(error));
              Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
              });
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: response?.message,
          });
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong!',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const socketConnectionRequest = (token: string) => {
    if (!isEmpty(token)) {
      const socket = io(SOCKET_BASE_URL, {
        autoConnect: true,
        auth: {
          token: token,
          isMobile: true,
        },
      });
      socket.connect(); // using this listner you can get "connected": true otherwise false
      setTimeout(() => {
        if (socket?.connected) {
          global.socketData = socket;
          socket.emit('join chat', global.currentUserData?.data?._id);
          props.navigation.reset({
            index: 0,
            routes: [{name: 'ChannelListScreen'}],
          });
        } else {
          setIsLoading(false);
        }
      }, 2500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
      <ScrollView style={styles.scrollViewContainer}>
        <ThemeTextInput
          label={'Email'}
          placeHolderText={'Enter email address'}
          value={email}
          setValue={setEmail}
          textInputContainerStyle={{marginTop: 30}}
        />

        <ThemeTextInput
          label={'Password'}
          placeHolderText={'Enter password'}
          value={password}
          setValue={setPassword}
          returnKeyType={'go'}
          blurOnSubmit={false}
          onSubmitEditing={() => _onPressLogin()}
        />

        <ThemeBtn
          btnText={'Login'}
          btnStyle={styles.btnStyle}
          onPress={_onPressLogin}
        />
      </ScrollView>
      <LoadingComponent isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  scrollViewContainer: {
    flex: 1,
  },

  btnStyle: {
    marginTop: 15,
  },
});
