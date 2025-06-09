import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  collapsed: false,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;