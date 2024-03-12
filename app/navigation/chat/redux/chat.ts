import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {put, takeLatest} from 'redux-saga/effects';
import {RootState} from '../../../types';
import chatapi from './model/chatapi';

export interface ChatStates {
  messageList: Array<Object>;
  channelsList: Array<Object>;
  channelsListLoading: boolean;
  channelsListPaginationLoading: boolean;
}

export type ContainerState = ChatStates;
// The initial state of the Chat container
export const initialState: ContainerState = {
  messageList: [],
  channelsList: [],
  channelsListLoading: false,
  channelsListPaginationLoading: false,
};
/**
 * ====== *********************  REDUX ACTIONS && REDUCERS ******************    =======
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    messageList(state, action: PayloadAction<any>) {
      state.messageList = state.messageList;
    },
    messageListSuccess(state, action: PayloadAction<any>) {
      state.messageList = action.payload.response;
    },
    messageListFailure(state, action: PayloadAction<any>) {
      state.messageList = action.payload;
    },
    channelsList(state, action: PayloadAction<any>) {
      if (action.payload.skip === 0) {
        state.channelsList = [];
        state.channelsListLoading = true;
        state.channelsListPaginationLoading = false;
      } else {
        state.channelsListPaginationLoading = true;
      }
    },
    channelsListSuccess(state, action: PayloadAction<any>) {
      state.channelsList.isNext = action.payload.response.isNext;
      if (action.payload.skip === 0) {
        state.channelsList = action.payload.response;
        state.channelsListLoading = false;
      } else {
        state.channelsList.data = state.channelsList.data.concat(
          action.payload.response?.data,
        );
        state.channelsListLoading = false;
        state.channelsListPaginationLoading = false;
      }
    },
    channelsListFailure(state, action: PayloadAction<any>) {
      state.channelsList = action.payload;
      state.channelsListLoading = false;
      state.channelsListPaginationLoading = false;
    },
  },
});
// Here Slice will create  action, reducer for the name
export const {
  actions: chatActions,
  reducer: chatReducers,
  name: chatSliceKey,
} = chatSlice;
/**
 * ====== *********************  REDUX SELECTOR ******************    =======
 */
// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.chat || initialState;
export const selectMessageList = createSelector(
  [selectDomain],
  ChatStates => ChatStates.messageList,
);
/**
 * ====== *********************  SAGA SECTION ******************    =======
 */
export function* getMessageListReq(props: any) {
  try {
    const response = yield chatapi.getMessage(props?.payload);
    if (response?.success) {
      yield put(
        chatActions.messageListSuccess({
          response: response,
        }),
      );
    } else {
      yield put(chatActions.messageListFailure({}));
    }
  } catch (error) {
    yield put(chatActions.messageListFailure({}));
  }
}
export function* getChannelsListReq(props: any) {
  try {
    const response = yield chatapi.getChannelsList(props?.payload);
    if (response?.success) {
      yield put(
        chatActions.channelsListSuccess({
          response: response,
          skip: props.payload.skip,
        }),
      );
    } else {
      yield put(chatActions.channelsListFailure({}));
    }
  } catch (error) {
    yield put(chatActions.channelsListFailure({}));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export function* chatFormSaga() {
  yield takeLatest(chatActions.messageList.type, getMessageListReq);
  yield takeLatest(chatActions.channelsList.type, getChannelsListReq);
}
