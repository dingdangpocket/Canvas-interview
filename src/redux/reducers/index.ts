import { combineReducers } from "redux";
import countReducer from "./countReducer";
import modelReducer from "./modelReducer";

export default combineReducers({
  counts: countReducer,
  model: modelReducer,
});
