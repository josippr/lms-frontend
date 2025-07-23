import {
  SET_NETWORK_STATUS_DATA,
  SET_NETWORK_STATUS_METRICS,
  SET_NETWORK_STATUS_LOADING,
  SET_NETWORK_STATUS_ERROR,
  SET_ACTIVE_DEVICES,
  APPEND_LIVE_NETWORK_STATUS,
  CLEAR_NETWORK_STATUS,
} from "../actions/types";

const MAX_LIVE_POINTS = 50; // Keep last 50 live data points

const initialState = {
  latestData: null,
  liveData: [], // Array of live network status updates
  metrics: {
    "1h": [],
    "6h": [],
    "12h": [],
    "24h": [],
  },
  activeDevices: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const networkStatus = (state = initialState, action) => {
  switch (action.type) {
    case SET_NETWORK_STATUS_DATA:
      return {
        ...state,
        latestData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case SET_NETWORK_STATUS_METRICS:
      return {
        ...state,
        metrics: action.payload,
        error: null,
      };

    case SET_NETWORK_STATUS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting to load
      };

    case SET_NETWORK_STATUS_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SET_ACTIVE_DEVICES:
      return {
        ...state,
        activeDevices: action.payload,
        error: null,
      };

    case APPEND_LIVE_NETWORK_STATUS:
      const newLiveData = [...state.liveData, action.payload];
      // Keep only the last MAX_LIVE_POINTS
      const trimmedLiveData = newLiveData.slice(-MAX_LIVE_POINTS);
      
      return {
        ...state,
        liveData: trimmedLiveData,
        latestData: action.payload, // Update latest data with live data
        activeDevices: action.payload?.payload?.networkStatus?.activeDevices || state.activeDevices,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case CLEAR_NETWORK_STATUS:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default networkStatus;
