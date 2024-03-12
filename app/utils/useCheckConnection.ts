import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

export const useCheckConnection = () => {
  let currentNetwork: boolean | null = true;
  NetInfo.fetch().then(state => {
    currentNetwork = state.isConnected;
  });
  const [netInfo, setNetInfo] = useState(currentNetwork);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setNetInfo(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return {netInfo};
};
