import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import {Persistor} from 'redux-persist/es/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';

import movieReducer, {MovieState} from './movieSlice';
import movieCacheTransform from './transform.ts';

interface RootState {
  movies: MovieState;
}

const rootReducer = combineReducers({
  movies: movieReducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['movies'],
  transforms: [movieCacheTransform], // Transform to persist only the movies.cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    // Fixes the issue "A non-serializable value was detected in an action, in the path: `register`"
    getDefaultMiddleware({serializableCheck: false}),
});

const persistor: Persistor = persistStore(store);

export {store, persistor};
export type {RootState};
export type AppDispatch = typeof store.dispatch;
