import { SET_NODE_STATUS, SET_NETWORK_STATUS, SET_NETWORK_USAGE, SET_ACTIVE_DEVICES_WIDGET, SET_SPEEDTEST_DATA } from "../actions/types";

const initialState = {
  nodeStatus: [],
  networkStatus: [],
  networkUsage: [],
  activeDevicesWidget: [],
  speedTestData: [],
};

const charts = (state = initialState, action) => {
  switch (action.type) {
    case SET_NODE_STATUS:
      return {
        ...state,
        nodeStatus: {
          ...state.nodeStatus,
          ...action.payload,
        },
      };
    case SET_NETWORK_STATUS:
      return {
        ...state,
        networkStatus: action.payload,
      };
    case SET_NETWORK_USAGE:
      return {
        ...state,
        networkUsage: action.payload,
      };
    case SET_ACTIVE_DEVICES_WIDGET:
      return {
        ...state,
        activeDevicesWidget: action.payload,
      };
    case SET_SPEEDTEST_DATA:
      return {
        ...state,
        speedTestData: action.payload,
      };
    default:
      return state;
  }
};

export default charts;