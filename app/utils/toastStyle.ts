import {Platform, StyleSheet} from 'react-native';
import {hasDynamicIsland} from 'react-native-device-info';
import AppColors from './AppColors';

const toastStyle: any = StyleSheet.create({
  success: {
    toastContainerStyle: {
      backgroundColor: '#F1FEFF',
      width: '95%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#067A80',
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      marginTop: Platform.OS == 'ios' && hasDynamicIsland() ? '2%' : 0,
    },

    toastTitleContainerStyle: {
      marginLeft: '2%',
      paddingHorizontal: '2%',
    },

    toastMainTitleTextStyle: {
      fontSize: 14,
      color: AppColors.black,
    },

    toastSubTitleTextStyle: {
      fontSize: 12,
      color: AppColors.black,
    },
  },

  error: {
    toastContainerStyle: {
      backgroundColor: '#FFF5F3',
      width: '95%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#F4B0A1',
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: Platform.OS == 'ios' && hasDynamicIsland() ? '2%' : 0,
    },

    toastTitleContainerStyle: {
      marginLeft: '2%',
      paddingHorizontal: '2%',
    },

    toastMainTitleTextStyle: {
      fontSize: 14,
      color: AppColors.black,
    },

    toastSubTitleTextStyle: {
      fontSize: 12,
      color: AppColors.black,
    },
  },

  info: {
    toastContainerStyle: {
      backgroundColor: '#F6FFF9',
      width: '95%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#48C1B5',
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      marginTop: Platform.OS == 'ios' && hasDynamicIsland() ? '2%' : 0,
    },

    toastTitleContainerStyle: {
      marginLeft: '2%',
      paddingHorizontal: '2%',
    },

    toastMainTitleTextStyle: {
      fontSize: 14,
      color: AppColors.black,
    },

    toastSubTitleTextStyle: {
      fontSize: 12,
      color: AppColors.black,
    },
  },
});

export default toastStyle;
