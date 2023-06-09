import { MetricTypes } from '~/api';
import { MetricsChartTypes } from '~/pages/modelServing/screens/metrics/types';
import { InferenceMetricType } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';

export const EMPTY_BIAS_CONFIGURATION_TITLE = 'Bias metrics not configured';
export const EMPTY_BIAS_CONFIGURATION_DESC =
  'Bias metrics for this model have not been configured. To monitor model bias, you must first configure metrics.';

export const METRIC_TYPE_DISPLAY_NAME: { [key in MetricTypes]: string } = {
  [MetricTypes.DIR]: 'Disparate impact ratio (DIR)',
  [MetricTypes.SPD]: 'Statistical parity difference (SPD)',
};

export const EMPTY_BIAS_CHART_SELECTION_TITLE = 'No Bias metrics selected';
export const EMPTY_BIAS_CHART_SELECTION_DESC =
  'No bias metrics have been selected. To display charts you must first select them using the metric selector.';

export const BIAS_THRESHOLD_COLOR = 'red';
export const BIAS_THRESHOLD_PADDING = 0.1;
export const DEFAULT_BIAS_THRESHOLD: { [key in MetricTypes]: number } = {
  [MetricTypes.SPD]: 0.2,
  [MetricTypes.DIR]: 0.1,
};

export const BIAS_CHART_TYPES: { [key in MetricTypes]: MetricsChartTypes } = {
  [MetricTypes.SPD]: MetricsChartTypes.AREA,
  [MetricTypes.DIR]: MetricsChartTypes.LINE,
};

export const BIAS_INFERENCE_DATA_TYPE: {
  [key in MetricTypes]: InferenceMetricType.TRUSTY_AI_SPD | InferenceMetricType.TRUSTY_AI_DIR;
} = {
  [MetricTypes.SPD]: InferenceMetricType.TRUSTY_AI_SPD,
  [MetricTypes.DIR]: InferenceMetricType.TRUSTY_AI_DIR,
};
