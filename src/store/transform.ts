import {createTransform} from 'redux-persist';
import {initialState, MovieState} from './movieSlice';

const movieCacheTransform = createTransform(
  (inboundState: MovieState) => {
    // Persist only the cache field
    return {cache: inboundState.cache};
  },
  (outboundState: Partial<MovieState>) => {
    // When rehydrating, merge cache back into the initial state structure
    return {
      ...outboundState,
      initialState,
    };
  },
  {whitelist: ['movies']},
);

export default movieCacheTransform;
