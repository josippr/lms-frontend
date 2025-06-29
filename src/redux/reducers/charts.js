import { SET_NODE_STATUS } from "../actions/types";

const initialState = {
  nodeStatus: {
    deviceName: "",
    nodeId: "",
    type: "",
    lastSync: "",
  },
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
    default:
      return state;
  }
};

export default charts;