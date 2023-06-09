import React from 'react';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';
import { ModelServingMetricsContext } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import { BiasMetricConfig } from '~/concepts/explainability/types';
import { calculateChartThresholds } from '~/pages/modelServing/screens/metrics/utils';
import { BIAS_CHART_CONFIGS } from '~/pages/modelServing/screens/metrics/const';

export type TrustyChartProps = {
  biasMetricConfig: BiasMetricConfig;
};

const TrustyChart: React.FC<TrustyChartProps> = ({ biasMetricConfig }) => {
  const { data } = React.useContext(ModelServingMetricsContext);

  const { id, metricType } = biasMetricConfig;

  const { title, abbreviation, inferenceMetricKey, chartType, domainCalculator } =
    BIAS_CHART_CONFIGS[metricType];

  // const metricDataKey = BIAS_INFERENCE_DATA_TYPE[biasMetricConfig.metricType];

  const metric = React.useMemo(() => {
    const metricData = data[inferenceMetricKey].data;

    const values = metricData.find((x) => x.metric.request === id)?.values;

    // const values = [];
    return {
      ...data[inferenceMetricKey],
      data: values,
    };
  }, [data, id, inferenceMetricKey]);

  // const type = React.useMemo(() => {
  //   if (metricType === InferenceMetricType.TRUSTY_AI_SPD) {
  //     return MetricsChartTypes.AREA;
  //   }
  //   return MetricsChartTypes.LINE;
  // }, [metricType]);

  return (
    <MetricsChart
      title={`${title} (${abbreviation})`}
      metrics={{
        name: abbreviation,
        metric: metric,
      }}
      domain={domainCalculator}
      thresholds={calculateChartThresholds(biasMetricConfig)}
      // thresholds={thresholds.map((t) => ({
      //   value: t,
      //   color: THRESHOLD_COLOR,
      // }))}
      type={chartType}
    />
  );
};

// const calculateThreshold = (x: BiasMetricConfig): [number, number] => {
//   if (x.metricType === MetricTypes.SPD) {
//     const threshold = x.thresholdDelta
//       ? x.thresholdDelta + PADDING
//       : DEFAULT_SPD_THRESHOLD + PADDING;
//     return [threshold, threshold * -1];
//   } else if (x.metricType === MetricTypes.DIR) {
//     const threshold = x.thresholdDelta
//       ? x.thresholdDelta + PADDING
//       : DEFAULT_DIR_THRESHOLD + PADDING;
//     return [threshold, threshold * -1];
//   }
//   throw new Error(`Illegal Metric type: ${x.metricType}`);
// };
//
// const calcThreshold2 = (x: BiasMetricConfig): MetricChartThreshold[] => {
//   let threshold = 0;
//
//   // if (x.metricType === MetricTypes.SPD) {
//   //   threshold = x.thresholdDelta ?? DEFAULT_SPD_THRESHOLD;
//   // } else if (x.metricType)
//
//   switch (x.metricType) {
//     case MetricTypes.SPD:
//       threshold = x.thresholdDelta ?? DEFAULT_SPD_THRESHOLD;
//       break;
//     case MetricTypes.DIR:
//       threshold = x.thresholdDelta ?? DEFAULT_DIR_THRESHOLD;
//       break;
//     default:
//       // Should be unreachable
//       throw new Error(`Illegal MetricType: ${x.metricType}`);
//   }
//
//   threshold = threshold + PADDING;
//   return [
//     {
//       value: threshold,
//       color: THRESHOLD_COLOR,
//     },
//     {
//       value: threshold * -1,
//       color: THRESHOLD_COLOR,
//     },
//   ];
// };
export default TrustyChart;
