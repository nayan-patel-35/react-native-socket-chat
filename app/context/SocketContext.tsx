import { createContext, useEffect, useState } from "react";
import { getMessageListRequest } from "../sharedUtils/services/api";

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
  const initialState = {
    user: user,
    channelsMessagesList: [],
    socketClient: socketClient,
  };
  const [state, setState] = useState<any>(initialState);

  useEffect(() => {
    if (token) {
      setState((prevState: any) => ({
        ...prevState,
        user: user,
        socketClient: socketClient,
      }));
    }
  }, [token]);

  useEffect(() => {
    if (socketClient) {
      newMessageListener();
    }
  }, [socketClient]);

  const getMessagesList = async (channelId: any) => {
    getMessageListRequest(channelId)
      .then((response: any) => {
        if (response?.success) {
          const reverseMessages =
            response?.data?.length > 0 ? response?.data?.reverse() : [];
          setState((prevState) => ({
            ...prevState,
            channelsMessagesList: reverseMessages,
          }));
        }
      })
      .catch((error: any) => {});
  };

  const appendMessages = (newMessages: any) => {
    let tempMessageList =
      state?.channelsMessagesList?.length > 0 ? state.channelsMessagesList : [];

    const newMessageData = {
      ...newMessages,
      sender: {
        _id: newMessages?.sender,
        updatedAt: new Date(),
      },
    };

    setState((prevState: any) => ({
      ...prevState,
      channelsMessagesList: [...tempMessageList, newMessageData],
    }));
  };

  const newMessageListener = () => {
    try {
      socketClient.on("message", (data) => {
        let newMessage = data?.newMsg;
        console.log("newMessageListenerRes", JSON.stringify(data));
        setState((prevState: any) => ({
          ...prevState,
          channelsMessagesList: [
            ...prevState?.channelsMessagesList,
            newMessage,
          ],
        }));
      });
    } catch (error) {
      console.log("newMessageListenerCatch", JSON.stringify(error));
    }
  };

  return (
    <SocketContext.Provider value={{ state, getMessagesList, appendMessages }}>
      {children}
    </SocketContext.Provider>
  );
};
