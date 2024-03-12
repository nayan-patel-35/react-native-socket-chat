import React, {useState} from 'react';
import {Keyboard, ScrollView, StatusBar, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {useInjectReducer, useInjectSaga} from 'redux-injectors';
import {io} from 'socket.io-client';
import LoadingComponent from '../../components/LoadingComponent';
import ThemeBtn from '../../components/ThemeBtn';
import ThemeTextInput from '../../components/ThemeTextInput';
import AppColors from '../../utils/AppColors';
import {isEmpty} from '../../utils/AppConstant';
import {
  AuthenticationSliceKey,
  authFormSaga,
  authenticationActions,
  authenticationReducers,
} from './redux/auth';
import authenticationapi from './redux/model/authenticationapi';

const CLIENT_ID: string | any = Config.CLIENT_ID;
const SOCKET_BASE_URL: string | any = Config.SOCKET_BASE_URL;
const BASE_URL: string | any = Config.BASE_URL;

const LoginScreen = (props: any) => {
  const dispatch = useDispatch();

  // .. selector
  useInjectReducer({
    key: AuthenticationSliceKey,
    reducer: authenticationReducers,
  });
  useInjectSaga({key: AuthenticationSliceKey, saga: authFormSaga});

  // .. state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('nayanp@softwareco.com');
  const [password, setPassword] = useState<string>('Nayan123!@#');
  const [socket, setSocket] = useState<any>(null);
  // const [email, setEmail] = useState<string>('jack@mailinator.com');
  // const [password, setPassword] = useState<string>('Jack123!@#');

  const _onPressLogin = async () => {
    Keyboard.dismiss();
    const params = {
      email,
      password,
    };

    try {
      const response = await authenticationapi.userLogin(params);
      console.log('userLoginRes', JSON.stringify(response));
      _handleLoginResponse(response);
    } catch (error) {
      console.log('userLoginResCatch', JSON.stringify(error));
      setIsLoading(false);
    }
  };

  const _handleLoginResponse = async (response: any) => {
    if (response?.success) {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: response.message,
      });
      const responseIsLoggedIn: any = await authenticationapi.isLoggedIn();
      console.log(
        'responseIsLoggedInRes',
        responseIsLoggedIn?.data?._id,
        responseIsLoggedIn?.data?.name,
        responseIsLoggedIn?.data?.email,
      );
      dispatch(
        authenticationActions.isLoginSuccess({
          userData: responseIsLoggedIn?.data,
        }),
      );
      _handleLoggedInResponse(responseIsLoggedIn);
    } else {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: response.message,
      });
    }
  };

  const _handleLoggedInResponse = async (responseIsLoggedIn: any) => {
    if (responseIsLoggedIn?.success) {
      const responseToken: any = await authenticationapi.getToken(
        responseIsLoggedIn?.data?._id,
        CLIENT_ID,
        BASE_URL,
      );
      console.log('responseTokenRes', JSON.stringify(responseToken));
      _handleTokenResponse(responseToken, responseIsLoggedIn?.data?._id);
    } else {
      Toast.show({
        type: 'error',
        text1: responseIsLoggedIn.message,
      });
    }
  };
  const _handleTokenResponse = (responseToken: any, userId: string) => {
    if (responseToken?.success) {
      dispatch(authenticationActions.setToken(responseToken.data));
      _socketConnectionRequest(responseToken.data, userId);
    } else {
      Toast.show({
        type: 'error',
        text1: responseToken.message,
      });
    }
  };

  const _socketConnectionRequest = (token: string, userId: string) => {
    if (!isEmpty(token)) {
      const socket = _initializeSocket(token);
      if (socket) {
        socket.connect(); // using this listener you can get "connected": true otherwise false
        setTimeout(() => {
          if (socket?.connected) {
            _handleSocketConnection(socket, userId);
          } else {
          }
        }, 2500);
      }
    }
  };

  const _initializeSocket = (token: string) => {
    return io(SOCKET_BASE_URL, {
      autoConnect: true,
      auth: {
        token: token,
        isMobile: true,
      },
    });
  };

  const _handleSocketConnection = (socket: any, userId: string) => {
    dispatch(authenticationActions.setSocketClient(socket));
    socket.emit('join chat', userId);
    props.navigation.reset({
      index: 0,
      routes: [{name: 'ChatStackNavigator'}],
    });
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
