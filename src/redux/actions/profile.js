import {
  SET_PROFILE,
  UPDATE_USERNAME,
  UPDATE_EMAIL,
  UPDATE_LANGUAGE,
  UPDATE_THEME,
  UPDATE_NOTIFICATION_PREFERENCE,
  SET_LICENSE_EXPIRATION,
  SET_LINKED_DEVICES,
  SET_PROFILE_STATUS,
  SET_PROFILE_ERROR
} from "../actions/types";

export const setProfile = (profileData) => ({
  type: SET_PROFILE,
  payload: profileData,
});

export const updateUsername = (username) => ({
  type: UPDATE_USERNAME,
  payload: username,
});

export const updateEmail = (email) => ({
  type: UPDATE_EMAIL,
  payload: email,
});

export const updateLanguage = (language) => ({
  type: UPDATE_LANGUAGE,
  payload: language,
});

export const updateTheme = (theme) => ({
  type: UPDATE_THEME,
  payload: theme,
});

export const updateNotificationPreference = (key, value) => ({
  type: UPDATE_NOTIFICATION_PREFERENCE,
  payload: { key, value },
});

export const setLicenseExpiration = (date) => ({
  type: SET_LICENSE_EXPIRATION,
  payload: date,
});

export const setLinkedDevices = (devices) => ({
  type: SET_LINKED_DEVICES,
  payload: devices,
});

export const setProfileStatus = (status) => ({
  type: SET_PROFILE_STATUS,
  payload: status,
});

export const setProfileError = (error) => ({
  type: SET_PROFILE_ERROR,
  payload: error,
});