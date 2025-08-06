import { combineReducers } from "redux";

import general from "./general";
import config from "./config";
import profile from "./profile";
import charts from "./charts";
import metrics from "./metrics";
import networkStatus from "./networkStatus";
import nodes from "./nodes";

const rootReducer = combineReducers({
  general: general,
  config: config,
  profile: profile,
  charts: charts,
  metrics: metrics,
  networkStatus: networkStatus,
  nodes: nodes,
});

export default rootReducer;