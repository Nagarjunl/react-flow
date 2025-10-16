import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import accountSlice from "./slice/Account";
import testDataSlice from "./slice/TestSlice";
import { authApi } from "../Api/authApi";
import { rulesApi } from "../Api/rulesApi";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, accountSlice);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [rulesApi.reducerPath]: rulesApi.reducer,
    auth: persistedAuthReducer,
    testData: testDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([authApi.middleware, rulesApi.middleware]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
