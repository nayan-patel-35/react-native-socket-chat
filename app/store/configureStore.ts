import {configureStore} from '@reduxjs/toolkit';
import {createInjectorsEnhancer, forceReducerReload} from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import {createReducer} from './rootReducer';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const {run: runSaga} = sagaMiddleware;
  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];
  const store = configureStore({
    reducer: createReducer(),
    // middleware: [...getDefaultMiddleware(), ...middlewares],
    // Here removed getDefaultMiddleware for avoiding A non-serializable value was detected in an action,
    middleware: [...middlewares],
    enhancers,
  });
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }
  return store;
}
