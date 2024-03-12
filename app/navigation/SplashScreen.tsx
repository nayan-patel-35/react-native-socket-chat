import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {useInjectReducer, useInjectSaga} from 'redux-injectors';
import {io} from 'socket.io-client';
import {isEmpty} from '../utils/AppConstant';
import {
  AuthenticationSliceKey,
  authFormSaga,
  authenticationActions,
  authenticationReducers,
} from './auth/redux/auth';
import authenticationapi from './auth/redux/model/authenticationapi';

const CLIENT_ID: string | any = Config.CLIENT_ID;
const SOCKET_BASE_URL: string | any = Config.SOCKET_BASE_URL;
const BASE_URL: string | any = Config.BASE_URL;

const SplashScreen = (props: any) => {
  const dispatch = useDispatch();

  // .. selector
  useInjectReducer({
    key: AuthenticationSliceKey,
    reducer: authenticationReducers,
  });
  useInjectSaga({key: AuthenticationSliceKey, saga: authFormSaga});

  useEffect(() => {
    checkUserIsLoggedIn();
  }, []);

  const checkUserIsLoggedIn = async () => {
    try {
      const responseIsLoggedIn: any = await authenticationapi.isLoggedIn();
      if (responseIsLoggedIn.success) {
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
        elseRedirection();
      }
    } catch (error) {
      elseRedirection();
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

  const elseRedirection = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  return <View style={styles.container}></View>;
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
