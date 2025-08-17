import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import UsersListSlice from "./slices/UsersSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";

const rootReducers = combineReducers({
  adminUser: AuthSlice.reducer,
  usersList: UsersListSlice.reducer,
});

const encryptor = encryptTransform({
  secretKey: "gffg-rwad-kite-5425",
  onError: (error) => console.log("persistError", error),
});

const persistedReducer = persistReducer({ key: "root", storage, transforms: [encryptor] }, rootReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (defaultMiddleware) => defaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export { persistor, store };
