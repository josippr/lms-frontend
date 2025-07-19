import { SET_NODE_STATUS, SET_NETWORK_STATUS } from "../actions/types";

const initialState = {
  nodeStatus: {
    deviceName: "",
    nodeId: "",
    type: "",
    lastSync: "",
  },
  networkStatus: [],
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
    default:
      return state;
  }
};

export default charts;