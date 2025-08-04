import { SET_NODE_STATUS, SET_NETWORK_STATUS, SET_NETWORK_USAGE } from "../actions/types";

const initialState = {
  nodeStatus: {
    deviceName: "",
    nodeId: "",
    type: "",
    lastSync: "",
  },
  networkStatus: [],
  networkUsage: [],
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
    default:
      return state;
  }
};

export default charts;