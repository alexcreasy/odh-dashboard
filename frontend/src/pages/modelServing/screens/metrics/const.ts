import { MetricTypes } from '~/api';
import { BiasChartConfigMap, MetricsChartTypes } from '~/pages/modelServing/screens/metrics/types';
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
  [MetricTypes.SPD]: 0.1,
  [MetricTypes.DIR]: 0.2,
};

export const BIAS_CHART_CONFIGS: BiasChartConfigMap = {
  [MetricTypes.SPD]: {
    title: 'Statistical Parity Difference',
    abbreviation: 'SPD',
    inferenceMetricKey: InferenceMetricType.TRUSTY_AI_SPD,
    chartType: MetricsChartTypes.AREA,
    domainCalculator: (maxYValue, minYValue) => {
      const defaultThreshold = DEFAULT_BIAS_THRESHOLD[MetricTypes.SPD];
      const max = Math.max(Math.abs(maxYValue), Math.abs(minYValue));

      return {
        y:
          max > defaultThreshold
            ? [-1 * max - BIAS_THRESHOLD_PADDING, max + BIAS_THRESHOLD_PADDING]
            : [
                defaultThreshold - BIAS_THRESHOLD_PADDING,
                defaultThreshold + BIAS_THRESHOLD_PADDING,
              ],
      };
    },
  },
  [MetricTypes.DIR]: {
    title: 'Disparate Impact Ratio',
    abbreviation: 'DIR',
    inferenceMetricKey: InferenceMetricType.TRUSTY_AI_DIR,
    chartType: MetricsChartTypes.LINE,
    domainCalculator: (maxYValue) => {
      const defaultThreshold = DEFAULT_BIAS_THRESHOLD[MetricTypes.DIR];

      return {
        y:
          maxYValue > defaultThreshold
            ? [0, maxYValue + BIAS_THRESHOLD_PADDING]
            : [0, defaultThreshold + BIAS_THRESHOLD_PADDING],
      };
    },
  },
};
