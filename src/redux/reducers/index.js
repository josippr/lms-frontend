import { combineReducers } from "redux";

import general from "./general";

const rootReducer = combineReducers({
  general: general
});

export default rootReducer;