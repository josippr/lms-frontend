import { combineReducers } from "redux";

import general from "./general";
import theme from "./theme";

const rootReducer = combineReducers({
  general: general,
  theme: theme,
});

export default rootReducer;