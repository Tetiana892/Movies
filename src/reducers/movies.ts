import { Action, Reducer } from "redux";

export interface Movie {
  id: number;
  title: string;
  popularity: number;
  overview: string;
}

interface MovieState {
  top: Movie[];
}

const initialState: MovieState = {
  top: [
    {
      id: 1,
      title: "Inception",
      popularity: 98,
      overview: "Dream...",
    },
    {
      id: 2,
      title: "Inception",
      popularity: 98,
      overview: "Dream...",
    },
    {
      id: 3,
      title: "Inception",
      popularity: 98,
      overview: "Dream...",
    },
    {
      id: 4,
      title: "Inception",
      popularity: 98,
      overview: "Dream...",
    },
  ],
};

const moviesReducer: Reducer<MovieState, Action> = (state, action) => {
  return initialState;
};

export default moviesReducer;
