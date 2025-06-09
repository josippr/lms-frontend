import { SET_IS_LOGGED_IN } from "../actions/types";

export const setIsLoggedIn = (isLoggedIn) => ({
  type: SET_IS_LOGGED_IN,
  payload: isLoggedIn,
});