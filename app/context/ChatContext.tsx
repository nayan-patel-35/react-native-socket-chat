import { createContext, useState } from 'react';

export const ChatContext = createContext(null);

export const ChatState = (props:any) => {

  // .. create initialState and store props value
  const initialState = {
    selectedChat: null,
  };

  // .. state: here store above created initialState values into state
  const [state, setState] = useState(initialState);

  // .. update selected chat
  const updateSelectedChat = (value:any) => {
    setState({...state, selectedChat: value});
  };

  return (
    <ChatContext.Provider value={{state, updateSelectedChat}}>
      {props.children}
    </ChatContext.Provider>
  );
};
