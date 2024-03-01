import {
  Image,
  LogBox,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {Assets} from './assets';
import NoInternetComponent from './components/NoInternetComponent';
import RootNavigator from './navigation';
import AppColors from './utils/AppColors';
import toastStyle from './utils/toastStyle';
import {useCheckConnection} from './utils/useCheckConnection';

console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Seems like you're using an old API"]);
LogBox.ignoreLogs(['Each child in a list should have a unique']);
LogBox.ignoreLogs([]);
LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs([
  'Warning: Each child in a list should have a unique "key" prop.',
]);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);
LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.",
]);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

global.currentUserData = null;
global.socketData = null;
global.token = null;

const App = () => {
  const {netInfo} = useCheckConnection();

  const toastConfig: any = {
    success: ({text1, props}: any) => (
      <View style={toastStyle.success.toastContainerStyle}>
        <Image
          source={Assets.toast_success_icon}
          style={{width: 24, height: 24}}
        />
        <View style={toastStyle.success.toastTitleContainerStyle}>
          <Text style={toastStyle.success.toastMainTitleTextStyle}>
            Success!
          </Text>
          <Text style={toastStyle.success.toastSubTitleTextStyle}>{text1}</Text>
        </View>
      </View>
    ),
    error: ({text1, props}: any) => (
      <View style={toastStyle.error.toastContainerStyle}>
        <Image
          source={Assets.toast_error_icon}
          style={{width: 24, height: 24}}
        />
        <View style={toastStyle.error.toastTitleContainerStyle}>
          <Text style={toastStyle.error.toastMainTitleTextStyle}>Error!</Text>
          <Text style={toastStyle.error.toastSubTitleTextStyle}>{text1}</Text>
        </View>
      </View>
    ),
    info: ({text1, props}: any) => (
      <View style={toastStyle.info.toastContainerStyle}>
        <Image
          source={Assets.toast_info_icon}
          style={{width: 24, height: 24}}
        />
        <View style={toastStyle.info.toastTitleContainerStyle}>
          <Text style={toastStyle.info.toastMainTitleTextStyle}>Info!</Text>
          <Text style={toastStyle.info.toastSubTitleTextStyle}>{text1}</Text>
        </View>
      </View>
    ),
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {netInfo ? (
        <RootNavigator />
      ) : (
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={AppColors.white}
          />
          <NoInternetComponent
            title={'No Internet Connection'}
            subTitle={'Check Your Internet Connection and try again'}
          />
        </SafeAreaView>
      )}
      <Toast topOffset={10} config={toastConfig} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
  },
});

export default App;
