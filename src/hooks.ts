import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch<AppDispatch>;

export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector);
