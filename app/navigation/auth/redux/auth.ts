import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {put, takeLatest} from 'redux-saga/effects';
import {RootState} from '../../../types';
import authenticationapi from './model/authenticationapi';

export interface AuthenticationStates {
  loggedInUserData: object;
  loggedStateLoading: boolean;
  token: string;
  socketClient: string;
}

export type ContainerState = AuthenticationStates;

// The initial state of the Auth container
export const initialState: ContainerState = {
  loggedInUserData: {},
  loggedStateLoading: false,
  token: '',
  socketClient: '',
};
/**
 * ====== *********************  REDUX ACTIONS && REDUCERS ******************    =======
 */
const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isLogin(state, action: PayloadAction<any>) {},
    isLoginSuccess(state, action: PayloadAction<any>) {
      state.loggedInUserData = action.payload.userData;
    },
    isLoginFailure(state, action: PayloadAction<boolean>) {
      state.loggedInUserData = {};
    },

    setToken(state, action: PayloadAction<any>) {
      state.token = action.payload;
    },

    setSocketClient(state, action: PayloadAction<any>) {
      state.socketClient = action.payload;
    },

    isLogout(state, action: PayloadAction<any>) {
      state.loggedStateLoading = true;
    },
    isLogoutSuccess(state, action: PayloadAction<any>) {
      state.loggedStateLoading = false;
      state.loggedInUserData = {};
    },
    isLogoutFailure(state, action: PayloadAction<boolean>) {
      state.loggedStateLoading = false;
    },
  },
});
// Here Slice will create  action, reducer for the name
export const {
  actions: authenticationActions,
  reducer: authenticationReducers,
  name: AuthenticationSliceKey,
} = authenticationSlice;
/**
 * ====== *********************  REDUX SELECTOR ******************    =======
 */
// First select the relevant part from the state
const selectDomain = (state: RootState) => state?.auth || initialState;
export const selectIsLoggedInUserData = createSelector(
  [selectDomain],
  AuthenticationStates => AuthenticationStates.loggedInUserData,
);
export const selectIsLoggedStateLoading = createSelector(
  [selectDomain],
  AuthenticationStates => AuthenticationStates.loggedStateLoading,
);
export const selectToken = createSelector(
  [selectDomain],
  AuthenticationStates => AuthenticationStates.token,
);
export const selectSocketClient = createSelector(
  [selectDomain],
  AuthenticationStates => AuthenticationStates.socketClient,
);
/**
 * ====== *********************  SAGA SECTION ******************    =======
 */
export function* isLoginReq(props: any) {
  try {
    yield put(
      authenticationActions.isLoginSuccess(props.payload.loggedInUserData),
    );
  } catch (error) {
    yield put(authenticationActions.isLoginFailure(false));
  }
}
export function* logout(props: any) {
  try {
    const response = yield authenticationapi.logout();
    if (response.success) {
      // props?.payload?.navigation.reset({
      //   index: 0,
      //   routes: [{name: 'LoginScreen'}],
      // });
      yield put(authenticationActions.isLogoutSuccess({}));
    } else {
      yield put(authenticationActions.isLogoutFailure({}));
    }
  } catch (error) {
    yield put(authenticationActions.isLogoutFailure({}));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export function* authFormSaga() {
  yield takeLatest(authenticationActions.isLogin.type, isLoginReq);
  yield takeLatest(authenticationActions.isLogout.type, logout);
}
