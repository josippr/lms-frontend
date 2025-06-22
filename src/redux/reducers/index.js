import { combineReducers } from "redux";

import general from "./general";
import config from "./config";
import profile from "./profile";

const rootReducer = combineReducers({
  general: general,
  config: config,
  profile: profile,
});

export default rootReducer;