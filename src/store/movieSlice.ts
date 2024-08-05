import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {BASE_URL, TMDB_API_READ_ACCESS_TOKEN} from '@env';

export type MovieStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface MovieState {
  results: Movie[];
  status: MovieStatus;
  error: string | null;
  cache: Record<string, Movie[]>;
}

const initialState: MovieState = {
  results: [],
  status: 'idle',
  error: null,
  cache: {},
};

export const fetchMovies = createAsyncThunk<
  Movie[],
  string,
  {rejectValue: string}
>('movies/fetchMovies', async (query: string, {getState, rejectWithValue}) => {
  const state = getState() as {movies: MovieState};
  // Return cached results if available
  if (state.movies.cache[query]) {
    return state.movies.cache[query];
  }
  try {
    const response: AxiosResponse<{
      results: Movie[];
    }> = await axios.get(`${BASE_URL}/search/movie`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
      },
      params: {query},
    });
    return response.data.results;
  } catch (err) {
    const error: AxiosError = err;
    return rejectWithValue(error.message);
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    purgeMovies(state) {
      state.results = [];
      state.status = 'idle';
      state.error = null;
    },
    clearCache(state) {
      state.results = [];
      state.cache = {};
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    // @ts-ignore
    builder
      .addCase(fetchMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.status = 'succeeded';
          state.results = action.payload;
          // Cache the results for that query
          const query = action.meta.arg;
          state.cache[query] = action.payload;
        },
      )
      .addCase(
        fetchMovies.rejected,
        (state, action: PayloadAction<string | null>) => {
          state.status = 'failed';
          state.error = action.payload || null;
        },
      );
  },
});

export const {purgeMovies, clearCache} = movieSlice.actions;
export default movieSlice.reducer;
