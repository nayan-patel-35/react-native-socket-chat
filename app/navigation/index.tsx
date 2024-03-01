import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import LoginScreen from './auth/LoginScreen';
import ChannelListScreen from './chat/ChannelListScreen';
import ChatMessageListScreen from './chat/ChatMessageListScreen';
import SplashScreen from './SplashScreen';

export const MAIN_STACK = createStackNavigator();

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
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
          name={'ChannelListScreen'}
          component={ChannelListScreen}
        />
        <MAIN_STACK.Screen
          name={'ChatMessageListScreen'}
          component={ChatMessageListScreen}
        />
      </MAIN_STACK.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
