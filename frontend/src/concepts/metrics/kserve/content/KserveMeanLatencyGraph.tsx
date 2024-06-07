import React from 'react';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';
import { TimeframeTitle } from '~/concepts/metrics/types';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';
//TODO: Remove this override, figure out where hooks should live.
// eslint-disable-next-line no-restricted-imports
import { useFetchKserveMeanLatencyData } from '~/api/prometheus/kservePerformanceMetrics';
import { convertPrometheusNaNToZero } from '~/pages/modelServing/screens/metrics/utils';

type KserveMeanLatencyGraphProps = {
  graphDefinition: KserveMetricGraphDefinition;
  timeframe: TimeframeTitle;
  end: number;
  namespace: string;
};

const KserveMeanLatencyGraph: React.FC<KserveMeanLatencyGraphProps> = ({
  graphDefinition,
  timeframe,
  end,
  namespace,
}) => {
  const {
    data: { requestLatency, inferenceLatency },
  } = useFetchKserveMeanLatencyData(graphDefinition, timeframe, end, namespace);

  return (
    <MetricsChart
      metrics={[
        {
          name: graphDefinition.queries[0].title,
          metric: {
            ...inferenceLatency,
            data: convertPrometheusNaNToZero(inferenceLatency.data),
          },
        },
        {
          name: graphDefinition.queries[1].title,
          metric: {
            ...requestLatency,
            data: convertPrometheusNaNToZero(requestLatency.data),
          },
        },
      ]}
      color="green"
      title={graphDefinition.title}
    />
  );
};

export default KserveMeanLatencyGraph;
