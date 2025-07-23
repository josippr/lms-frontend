import {
  SET_NETWORK_STATUS_DATA,
  SET_NETWORK_STATUS_METRICS,
  SET_NETWORK_STATUS_LOADING,
  SET_NETWORK_STATUS_ERROR,
  SET_ACTIVE_DEVICES,
  APPEND_LIVE_NETWORK_STATUS,
  CLEAR_NETWORK_STATUS,
} from "./types";

export const setNetworkStatusData = (data) => ({
  type: SET_NETWORK_STATUS_DATA,
  payload: data,
});

export const setNetworkStatusMetrics = (metrics) => ({
  type: SET_NETWORK_STATUS_METRICS,
  payload: metrics,
});

export const setNetworkStatusLoading = (isLoading) => ({
  type: SET_NETWORK_STATUS_LOADING,
  payload: isLoading,
});

export const setNetworkStatusError = (error) => ({
  type: SET_NETWORK_STATUS_ERROR,
  payload: error,
});

export const setActiveDevices = (devices) => ({
  type: SET_ACTIVE_DEVICES,
  payload: devices,
});

export const appendLiveNetworkStatus = (data) => ({
  type: APPEND_LIVE_NETWORK_STATUS,
  payload: data,
});

export const clearNetworkStatus = () => ({
  type: CLEAR_NETWORK_STATUS,
});
