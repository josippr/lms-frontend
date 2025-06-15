import { combineReducers } from "redux";

import general from "./general";
import theme from "./theme";
import profile from "./profile";

const rootReducer = combineReducers({
  general: general,
  theme: theme,
  profile: profile,
});

export default rootReducer;