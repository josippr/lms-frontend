import { SET_NODE_DATA } from "../actions/types";

const initialState = {
  data: [],
};

const nodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NODE_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default nodeReducer;
