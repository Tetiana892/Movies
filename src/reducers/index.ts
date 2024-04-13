import { combineReducers } from "redux";
import moviesReducer from "./moviesSlice";

const rootReducer = combineReducers({
  movies: moviesReducer,
});

export default rootReducer;
