import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice'
import {persistReducer} from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import {persistStore} from 'redux-persist'
import themeSlice from './Slices/themeSlice'

//combine the reducers
const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice
})

const persistConfig = {
  key: 'root',
  storage: storageSession, 
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  //to prevent errors
  middleware: (getDefaultMiddleware)=> 
    getDefaultMiddleware({ serializableCheck: false}) 
})

export const persistor = persistStore(store)