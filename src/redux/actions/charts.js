import { SET_NODE_STATUS, SET_NETWORK_STATUS } from './types';

export const setNodeStatus = (status) => ({
  type: SET_NODE_STATUS,
  payload: status,
});

export const setNetworkStatus = (status) => ({
  type: SET_NETWORK_STATUS,
  payload: status,
});