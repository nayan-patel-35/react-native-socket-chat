import moment from 'moment';
import { createContext, useEffect, useState } from 'react';
import {
  getChannelListRequest,
  getMessageListRequest,
} from '../sharedUtils/services/api';
import { SOCKET_EVENT_TYPE } from '../utils/AppConstant';

export const SocketContext = createContext(null);

interface SocketStateProps {
  token: string;
  socketClient: any;
  user: any;
  children?: React.ReactNode;
}

export const SocketState = ({
  token,
  socketClient,
  user,
  children,
}: SocketStateProps) => {
  // Create initial state with props values
  const initialState = {
    token,
    socketClient,
    user,
    channelList: [],
    channelsMessagesList: [],
  };

  const [state, setState] = useState(initialState);

  // Fetch channel list on component mount
  useEffect(() => {
    getChannelList();
  }, []);

  // Fetch channel list from API
  const getChannelList = () => {
    getChannelListRequest(user?._id, token)
      .then((response: any) => {
        if (response?.success) {
          setState((prevState: any) => ({
            ...prevState,
            channelList: response?.data,
          }));
        }
      })
      .catch(error => {
        console.log('getChannelListRequestCatch', error);
      });
  };

  // Fetch messages list for a given channel ID
  const getMessagesList = async (channelId: any) => {
    getMessageListRequest(channelId, token)
      .then((response: any) => {
        if (response?.success) {
          const tempMessageList = response?.data
            ?.reverse()
            ?.map((item: any) => ({
              ...item,
              list: item?.list?.length > 0 ? item?.list : [],
            }));
          setState((prevState: any) => ({
            ...prevState,
            channelsMessagesList: tempMessageList,
          }));
        }
      })
      .catch((error: any) => {
        console.log('getMessageListRequestCatch', error);
      });
  };

  // Append new messages to the channelsMessagesList
  const appendMessages = (newMessages: any) => {
    setState((prevState: any) => {
      const tempMessageList = prevState?.channelsMessagesList;
      console.log('appendMessages', tempMessageList?.length);
      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      const updatedArray = tempMessageList.filter(
        (data: any) => data.date !== currentDate,
      );
      const newArray = tempMessageList
        .filter((data: any) => data.date === currentDate)
        .map((data: any) => ({
          ...data,
          list: data.list ? [...data.list, newMessages] : [newMessages],
        }));

      return {
        ...prevState,
        channelsMessagesList: [...updatedArray, ...newArray],
      };
    });
  };

  // Listen for incoming messages on the socket
  const socketOnMessage = () => {
    try {
      socketClient.on(SOCKET_EVENT_TYPE.MESSAGE, (messageData: any) => {
        console.log('messageData', JSON.stringify(messageData));
        const newMessages = messageData?.newMsg;
        setState((prevState: any) => {
          const tempMessageList = prevState?.channelsMessagesList;
          console.log('socketOnMessage', tempMessageList?.length);
          const currentDate = moment(new Date()).format('YYYY-MM-DD');
          const constArray = tempMessageList.map((data: any) => {
            if (currentDate === data?.date) {
              return {
                ...data,
                list: data?.list ? [...data.list, newMessages] : [newMessages],
              };
            } else {
              getMessagesList(newMessages?.channelId);
              return data; // Return unmodified data for other dates
            }
          });

          return {
            ...prevState,
            channelsMessagesList: constArray,
          };
        });
      });
    } catch (error) {
      console.log('newMessageListenerCatch', error);
    }
  };

  // Listen for socket client change
  useEffect(() => {
    console.log('socketClient', socketClient);
    if (socketClient) {
      socketOnMessage();
    }
  }, [socketClient]);

  return (
    <SocketContext.Provider
      value={{ state, getMessagesList, appendMessages, getChannelList }}>
      {children}
    </SocketContext.Provider>
  );
};
