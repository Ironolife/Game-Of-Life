import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import dataReducer from './reducers/dataReducer';

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
