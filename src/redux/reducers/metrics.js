import { SET_LIVE_METRICS, SET_HISTORICAL_METRICS, APPEND_LIVE_METRIC, CLEAR_METRICS } from "../actions/types";


const initialState = {
  live: [],
  historical: [],
};

const metrics = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_METRICS:
      return { ...state, live: action.payload };
    case SET_HISTORICAL_METRICS:
      return { ...state, historical: action.payload };
    case APPEND_LIVE_METRIC:
      const updatedLive = [...state.live, action.payload];
      return { ...state, live: updatedLive.slice(-30) };
    case CLEAR_METRICS:
      return initialState;
    default:
      return state;
  }
};

export default metrics;
