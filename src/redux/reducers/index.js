import { combineReducers } from "redux";

import general from "./general";
import config from "./config";
import profile from "./profile";
import charts from "./charts";
import metrics from "./metrics";

const rootReducer = combineReducers({
  general: general,
  config: config,
  profile: profile,
  charts: charts,
  metrics: metrics,
});

export default rootReducer;