import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../redux/usersSlice';
import assignAssetReducer from '../redux/assignAssetSlice';
import maintenanceReducer from '../redux/maintenanceSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    assignAsset: assignAssetReducer,
    maintenance: maintenanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
