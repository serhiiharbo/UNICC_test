import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import movieReducer from './movieSlice';

interface RootState {
  movies: ReturnType<typeof movieReducer>;
}

const rootReducer = combineReducers({
  movies: movieReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    // Fixes the issue "A non-serializable value was detected in an action, in the path: `register`"
    getDefaultMiddleware({serializableCheck: false}),
});

export {store};
export type {RootState};
export type AppDispatch = typeof store.dispatch;
