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
  movies: Movie[];
  status: MovieStatus;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  status: 'idle',
  error: null,
};

export const fetchMovies = createAsyncThunk<
  Movie[],
  string,
  {rejectValue: string}
>('movies/fetchMovies', async (query: string, {rejectWithValue}) => {
  try {
    const response: AxiosResponse<{
      results: Movie[];
    }> = await axios.get(`${BASE_URL}/search/movie`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`, // Use the environment variable here
      },
      params: {
        query,
      },
    });
    return response.data.results;
  } catch (err: AxiosError<unknown, any>) {
    const error: AxiosError = err;
    return rejectWithValue(error.message);
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // @ts-ignore
    builder
      .addCase(fetchMovies.pending, (state: MovieState) => {
        state.status = 'loading';
      })
      .addCase(
        fetchMovies.fulfilled,
        (state: MovieState, action: PayloadAction<Movie[]>) => {
          state.status = 'succeeded';
          state.movies = action.payload;
        },
      )
      .addCase(
        fetchMovies.rejected,
        (state: MovieState, action: PayloadAction<string | null>) => {
          state.status = 'failed';
          state.error = action.payload || null;
        },
      );
  },
});

export default movieSlice.reducer;
