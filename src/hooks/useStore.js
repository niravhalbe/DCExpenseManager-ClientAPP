import { useContext } from "react";
import { rootStoreContext } from "../store/Index";

export const useStore = () => useContext(rootStoreContext);