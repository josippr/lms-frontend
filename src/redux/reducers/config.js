import { SET_THEME } from "../actions/types";

const initialState = {
  theme: "dark",
  language: "hr",
};

const config = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

export default config;