import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../redux/usersSlice';
import assignAssetReducer from '../redux/assignAssetSlice';
import maintenanceReducer from '../redux/maintenanceSlice';
import employeesReducer from '../redux/employeesSlice';
import departmentsReducer from '../redux/departmentsSlice';
import categoriesReducer from '../redux/categoriesSlice';
import locationsReducer from '../redux/locationsSlice';
import themeReducer from '../redux/themeSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    assignAsset: assignAssetReducer,
    maintenance: maintenanceReducer,
    employees: employeesReducer,
    departments: departmentsReducer,
    categories: categoriesReducer,
    locations: locationsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
