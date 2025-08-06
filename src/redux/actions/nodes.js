import { SET_NODE_DATA } from "./types";

export const setNodeData = (data) => ({
  type: SET_NODE_DATA,
  payload: data,
});
