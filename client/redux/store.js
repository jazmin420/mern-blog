import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {persistStore} from 'redux-persist'
import themeSlice from './Slices/themeSlice'

//combine the reducers
const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice
})

const persistConfig = {
  key: 'root',
  storage, 
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