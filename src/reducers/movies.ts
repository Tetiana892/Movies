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
  page: number;
  hasMorePages: boolean;
}

const initialState: MovieState = {
  top: [],
  loading: false,
  page: 0,
  hasMorePages: true,
};

const moviesLoaded = (movies: Movie[], page: number, hasMorePages: boolean) => ({
  type: "movies/loaded",
  payload: { movies, page, hasMorePages },
});

const moviesLoading = () => ({
  type: "movies/loading",
});

export function fetchNextPage(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const nextPage = getState().movies.page + 1;
    dispatch(fetchPage(nextPage));
  };
}

function fetchPage(page: number): AppThunk<Promise<void>> {
  return async (dispatch) => {
    dispatch(moviesLoading());

    try {
      // const config = await client.getConfiguration();
      // const imageUrl = config.images.base_url;
      const nowPlaing = await client.getNowPlaying(page);

      const mappedResults: Movie[] = nowPlaing.results.map((m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        popularity: m.popularity,
        // image: m.backdrop_path ? `${imageUrl}w780${m.backdrop_path}` : undefined,
      }));

      const hasMorePages = nowPlaing.page < nowPlaing.totalPages;

      dispatch(moviesLoaded(mappedResults, page, hasMorePages));
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };
}

const moviesReducer = createReducer<MovieState>(initialState, {
  "movies/loaded": (
    state,
    action: ActionWhithPayload<{ movies: Movie[]; page: number; hasMorePages: boolean }>
  ) => {
    return {
      ...state,
      top: [...state.top, ...action.payload.movies],
      page: action.payload.page,
      hasMorePages: action.payload.hasMorePages,
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
