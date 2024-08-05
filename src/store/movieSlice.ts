import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {BASE_URL, TMDB_API_READ_ACCESS_TOKEN} from '@env';

import {REQUEST_STATUS} from '../constants';

export type MovieStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

export interface MovieState {
  results: Movie[];
  status: MovieStatus;
  error: string | null;
  cache: Record<string, Movie[]>;
  currentPage: number;
  totalPages: number;
}

export const initialState: MovieState = {
  results: [],
  status: REQUEST_STATUS.IDLE,
  error: null,
  cache: {},
  currentPage: 1,
  totalPages: 1,
};

export const fetchMovies = createAsyncThunk<
  Movie[],
  {query: string; page: number},
  {rejectValue: string}
>('movies/fetchMovies', async ({query, page}, {getState, rejectWithValue}) => {
  const state = getState() as {movies: MovieState};
  const cacheKey = `${query}-${page}`;
  // Return cached results if available
  if (state.movies.cache[cacheKey]) {
    return state.movies.cache[cacheKey];
  }
  // Otherwise, fetch the data from the API
  try {
    const response: AxiosResponse<{
      results: Movie[];
      page: number;
      total_pages: number;
    }> = await axios.get(`${BASE_URL}/search/movie?include_adult=false`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
      },
      params: {query, page},
    });
    return {...response.data, query};
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
      state.status = REQUEST_STATUS.IDLE;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
    },
    clearCache(state) {
      state.results = [];
      state.cache = {};
      state.status = REQUEST_STATUS.IDLE;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.status = REQUEST_STATUS.LOADING;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.SUCCEEDED;
        const {results = [], page, total_pages, query} = action.payload;
        if (page === 1) {
          state.results = results;
        } else {
          state.results = [...state.results, ...results];
        }
        state.currentPage = page;
        state.totalPages = total_pages;
        // Cache the results for the query and page
        const cacheKey = `${query}-${page}`;
        state.cache[cacheKey] = {results, page, total_pages, query};
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = REQUEST_STATUS.FAILED;
        state.error = action.payload || null;
      });
  },
});

export const {purgeMovies, clearCache} = movieSlice.actions;
export default movieSlice.reducer;
