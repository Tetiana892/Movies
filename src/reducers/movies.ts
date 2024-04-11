import { ActionWhithPayload, createReducer } from "../redux/utils";
import { AppThunk } from "../store";
import { client } from "../api/tmdb";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  image?: string;
}

interface MovieState {
  top: Movie[];
  loading: boolean;
}

const initialState: MovieState = {
  top: [],
  loading: false,
};

const moviesLoaded = (movies: Movie[]) => ({
  type: "movies/loaded",
  payload: movies,
});

const moviesLoading = () => ({
  type: "movies/loading",
});

export function fethMovies(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(moviesLoading());

    const config = await client.getConfiguration();
    const imageUrl = config.images.base_url;
    const results = await client.getNowPlaying();

    const mappedResults: Movie[] = results.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      popularity: m.popularity,
      image: m.backdrop_path ? `${imageUrl}w780${m.backdrop_path}` : undefined,
    }));
    dispatch(moviesLoaded(mappedResults));
  };
}

const moviesReducer = createReducer<MovieState>(initialState, {
  "movies/loaded": (state, action: ActionWhithPayload<Movie[]>) => {
    return {
      ...state,
      top: action.payload,
      loading: false,
    };
  },
  "movies/loading": (state, action) => {
    return {
      ...state,
      loading: true,
    };
  },
});

export default moviesReducer;
