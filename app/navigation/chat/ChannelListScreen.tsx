import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChannelListComponent from '../../components/chat/ChannelListComponent';
import {getChannelListRequest} from '../../sharedUtils/services/api';
import AppColors from '../../utils/AppColors';

const ChannelListScreen = (props: any) => {
  // .. state
  const [channelList, setChannelList]: any[] = useState([]);
  console.log('currentUser', global.currentUserData?.data?._id);

  useFocusEffect(
    useCallback(() => {
      getChannelListAPICall();
    }, []),
  );

  const getChannelListAPICall = () => {
    getChannelListRequest(global.currentUserData?.data?._id)
      .then((response: any) => {
        console.log('getChannelListRequestRes', JSON.stringify(response));
        if (response?.success) {
          setChannelList(response?.data);
        }
      })
      .catch((error: any) => {
        console.log('getChannelListRequestCatch', JSON.stringify(error));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={AppColors.white} />
      <ChannelListComponent
        data={channelList}
        onPress={item => {
          props.navigation.navigate('ChatMessageListScreen', {item: item});
        }}
      />
    </SafeAreaView>
  );
};

export default ChannelListScreen;

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
