import {ImageSourcePropType} from 'react-native';

import {MovieStatus} from '../store/movieSlice.ts';

export const IMAGE_PLACEHOLDER: ImageSourcePropType = require('../assets/placeholder.png');
export const DEBOUNCE_TIMEOUT: number = 200;
export const REQUEST_STATUS: Record<string, MovieStatus> = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};
