import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state"; // this is the reducer we created in state/index.js
import { configureStore } from "@reduxjs/toolkit"; // this is the redux store
import { Provider } from "react-redux"; // this is the react-redux provider
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; // specific to use redux-persist
import storage from "redux-persist/lib/storage"; // storage
import { PersistGate } from "redux-persist/integration/react"; //storage

//above imports for local storage on user session

const persistConfig = { key: "root", storage, version: 1 }; // this is the config for redux-persist
const persistedReducer = persistReducer(persistConfig, authReducer); // this is the persisted reducer using authReducer and persistConfig
const store = configureStore({ 
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
}); // initialize our store

const root = ReactDOM.createRoot(document.getElementById("root")); // create root for react-dom
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}> {/* this is the persist gate for redux-persist */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
