import { SET_NODE_STATUS } from './types';

export const setNodeStatus = (status) => ({
  type: SET_NODE_STATUS,
  payload: status,
});