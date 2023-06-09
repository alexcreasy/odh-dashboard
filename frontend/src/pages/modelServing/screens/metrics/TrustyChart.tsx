import React from 'react';
import { Stack } from '@patternfly/react-core';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';
import {
  InferenceMetricType,
  ModelServingMetricsContext,
} from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import { DomainCalculator, MetricsChartTypes } from '~/pages/modelServing/screens/metrics/types';
import { BiasMetricConfig } from '~/concepts/explainability/types';
import { calculateChartThreshold } from '~/pages/modelServing/screens/metrics/utils';
import {
  BIAS_CHART_TYPES,
  BIAS_INFERENCE_DATA_TYPE,
} from '~/pages/modelServing/screens/metrics/const';

export type TrustyChartProps = {
  title: string;
  abbreviation: string;
  metricType?: InferenceMetricType.TRUSTY_AI_SPD | InferenceMetricType.TRUSTY_AI_DIR;
  tooltip?: React.ReactElement<typeof Stack>;
  thresholds?: [number, number];
  domain: DomainCalculator;
  id: string;
  biasMetricConfig: BiasMetricConfig;
};

const TrustyChart: React.FC<TrustyChartProps> = ({
  title,
  abbreviation,
  domain,
  id,
  biasMetricConfig,
}) => {
  const { data } = React.useContext(ModelServingMetricsContext);

  const metricType2 = BIAS_INFERENCE_DATA_TYPE[biasMetricConfig.metricType];

  const metric = React.useMemo(() => {
    const metricData = data[metricType2].data;

    const values = metricData.find((x) => x.metric.request === id)?.values;

    // const values = [];
    return {
      ...data[metricType2],
      data: values,
    };
  }, [data, id, metricType2]);

  // const type = React.useMemo(() => {
  //   if (metricType === InferenceMetricType.TRUSTY_AI_SPD) {
  //     return MetricsChartTypes.AREA;
  //   }
  //   return MetricsChartTypes.LINE;
  // }, [metricType]);

  const type = BIAS_CHART_TYPES[biasMetricConfig.metricType];

  return (
    <MetricsChart
      title={`${title} (${abbreviation})`}
      metrics={{
        name: abbreviation,
        metric: metric,
      }}
      domain={domain}
      thresholds={calculateChartThreshold(biasMetricConfig)}
      // thresholds={thresholds.map((t) => ({
      //   value: t,
      //   color: THRESHOLD_COLOR,
      // }))}
      type={type}
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
