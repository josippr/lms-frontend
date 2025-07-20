import {
  SET_PROFILE,
  UPDATE_USERNAME,
  UPDATE_EMAIL,
  UPDATE_LANGUAGE,
  UPDATE_THEME,
  UPDATE_NOTIFICATION_PREFERENCE,
  SET_LICENSE_EXPIRATION,
  SET_LINKED_NODES,
  SET_PROFILE_STATUS,
  SET_PROFILE_ERROR,
  SET_PROFILE_LOADED,
} from "../actions/types";

const initialState = {
  loaded: false,
  username: '',
  email: '',
  language: 'en',
  theme: 'light',
  routes: [],
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
  },
  licenseExpirationDate: null,
  linkedNodes: [],
  status: 'idle',
  error: null,
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        ...action.payload,
      };

    case UPDATE_USERNAME:
      return { ...state, username: action.payload };

    case UPDATE_EMAIL:
      return { ...state, email: action.payload };

    case UPDATE_LANGUAGE:
      return { ...state, language: action.payload };

    case UPDATE_THEME:
      return { ...state, theme: action.payload };

    case UPDATE_NOTIFICATION_PREFERENCE:
      return {
        ...state,
        notificationPreferences: {
          ...state.notificationPreferences,
          [action.payload.key]: action.payload.value,
        },
      };

    case SET_LICENSE_EXPIRATION:
      return { ...state, licenseExpirationDate: action.payload };

    case SET_LINKED_NODES:
      return { ...state, linkedNodes: action.payload };

    case SET_PROFILE_STATUS:
      return { ...state, status: action.payload };

    case SET_PROFILE_ERROR:
      return { ...state, error: action.payload };
    
    case SET_PROFILE_LOADED:
      return { ...state, loaded: action.payload };

    default:
      return state;
  }
}