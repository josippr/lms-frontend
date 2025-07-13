import { SET_LIVE_METRICS, SET_HISTORICAL_METRICS, APPEND_LIVE_METRIC, CLEAR_METRICS } from "./types";

export const setLiveMetrics = (data) => ({
  type: SET_LIVE_METRICS,
  payload: data,
});

export const setHistoricalMetrics = (data) => ({
  type: SET_HISTORICAL_METRICS,
  payload: data,
});

export const appendLiveMetric = (data) => ({
  type: APPEND_LIVE_METRIC,
  payload: data,
});

export const clearMetrics = () => ({
  type: CLEAR_METRICS,
  payload: null,
});
