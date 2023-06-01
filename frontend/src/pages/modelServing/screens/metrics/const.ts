import { MetricTypes } from '~/api';

export const EMPTY_BIAS_CONFIGURATION_TITLE = 'Bias metrics not configured';
export const EMPTY_BIAS_CONFIGURATION_DESC =
  'Bias metrics for this model have not been configured. To monitor model bias, you must first configure metrics.';

export const METRIC_TYPE_DISPLAY_NAME = {
  [MetricTypes.DIR]: 'Disparate impact ratio (DIR)',
  [MetricTypes.SPD]: 'Statistical parity difference (SPD)',
};

export const EMPTY_BIAS_CHART_SELECTION_TITLE = 'No Bias metrics selected';
export const EMPTY_BIAS_CHART_SELECTION_DESC =
  'No bias metrics have been selected. To display charts you must first select them using the metric selector.';

export const DEFAULT_MAX_THRESHOLD = 0.1;
export const DEFAULT_MIN_THRESHOLD = -0.1;
export const PADDING = 0.1;
