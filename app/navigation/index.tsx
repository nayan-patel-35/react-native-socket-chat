import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {ChatState, SocketState} from 'react-native-socket-chat';
import {useSelector} from 'react-redux';
import LoginScreen from './auth/LoginScreen';
import {
  selectIsLoggedInUserData,
  selectSocketClient,
  selectToken,
} from './auth/redux/auth';
import ChannelList from './chat/ChannelList';
import ChatMessageListScreen from './chat/ChatMessageListScreen';
import SplashScreen from './SplashScreen';

export const MAIN_STACK = createStackNavigator();
export const STACK = createStackNavigator();
const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const ChatStackNavigator = () => {
  let token = useSelector(selectToken);
  let socketClient = useSelector(selectSocketClient);
  let userData = useSelector(selectIsLoggedInUserData);
  console.log('ChatStackNavigator', socketClient?.id);
  return (
    <SocketState token={token} socketClient={socketClient} user={userData}>
      <ChatState>
        <STACK.Navigator
          screenOptions={{
            headerMode: false,
            ...TransitionScreenOptions,
          }}
          initialRouteName="ChannelList">
          <STACK.Screen name={'ChannelList'} component={ChannelList} />
          <STACK.Screen
            name={'ChatMessageListScreen'}
            component={ChatMessageListScreen}
          />
        </STACK.Navigator>
      </ChatState>
    </SocketState>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <MAIN_STACK.Navigator
        screenOptions={{
          headerMode: false,
          ...TransitionScreenOptions,
        }}
        initialRouteName={'SplashScreen'}>
        <MAIN_STACK.Screen name={'SplashScreen'} component={SplashScreen} />
        <MAIN_STACK.Screen name={'LoginScreen'} component={LoginScreen} />
        <MAIN_STACK.Screen
          name={'ChatStackNavigator'}
          children={() => <ChatStackNavigator />}
        />
      </MAIN_STACK.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
