import {AuthenticationStates} from '../navigation/auth/redux/auth';
import {ChatStates} from '../navigation/chat/redux/chat';

export interface RootState {
  auth?: AuthenticationStates;
  chat?: ChatStates;
}
