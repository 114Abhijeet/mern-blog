import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
// storage from redux-persist/lib/storage: Default local storage for web.
import storage from 'redux-persist/lib/storage';

// combineReducers is used to combine multiple reducers into a single root reducer. In this case, only 
// userReducer is being combined.
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
  });
  
  //persistConfig specifies how and where the state should be persisted. The key root is used as the storage 
  //key, and storage specifies the storage type (local storage).
  const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);

// Previous Code
// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

//configureStore sets up the store with the persistent reducer and disables serializable check middleware to prevent
//errors related to non-serializable data.
 export const store = configureStore({
  //Instead of having lot of reducer we can just add one.
   reducer:  persistedReducer,
   // To prevent a default error
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
 });

 export const persistor = persistStore(store);
