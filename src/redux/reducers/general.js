import { SET_IS_LOGGED_IN } from "../actions/types";

const initialState = {
  isLoggedIn: false,
};

const general = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};

export default general;