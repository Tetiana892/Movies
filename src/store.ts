import { createStore } from "redux";
import rootReducer from "./reducers";

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;

export default store;
