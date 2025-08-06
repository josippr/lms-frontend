import { SET_NODE_STATUS, SET_NETWORK_STATUS, SET_NETWORK_USAGE, SET_ACTIVE_DEVICES_WIDGET, SET_SPEEDTEST_DATA } from './types';

export const setNodeStatus = (status) => ({
  type: SET_NODE_STATUS,
  payload: status,
});

export const setNetworkStatus = (status) => ({
  type: SET_NETWORK_STATUS,
  payload: status,
});

export const setNetworkUsage = (usage) => ({
  type: SET_NETWORK_USAGE,
  payload: usage,
});

export const setActiveDevicesWidget = (activeDevices) => ({
  type: SET_ACTIVE_DEVICES_WIDGET,
  payload: activeDevices,
});

export const setSpeedTestData = (data) => ({
  type: SET_SPEEDTEST_DATA,
  payload: data,
});