import {useSelector} from 'react-redux';
import {useInjectReducer, useInjectSaga} from 'redux-injectors';
import {
  AuthenticationSliceKey,
  authFormSaga,
  authenticationReducers,
  selectToken,
} from '../navigation/auth/redux/auth';

export const useToken = (): string => {
  // .. reducer
  const token: any = useSelector(selectToken);
  useInjectReducer({
    key: AuthenticationSliceKey,
    reducer: authenticationReducers,
  });
  useInjectSaga({key: AuthenticationSliceKey, saga: authFormSaga});

  return token;
};
