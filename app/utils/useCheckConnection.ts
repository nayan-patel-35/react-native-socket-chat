import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';

export const useCheckConnection = () => {
  let currentNetwork: boolean = true;
  NetInfo.fetch().then(state => {
    currentNetwork = state.isConnected;
  });
  const [netInfo, setNetInfo] = React.useState(currentNetwork);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return {netInfo};
};
