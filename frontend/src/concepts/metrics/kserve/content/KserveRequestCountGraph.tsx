import React from 'react';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';
// eslint-disable-next-line no-restricted-imports
import { useFetchKserveRequestCountData } from '~/api/prometheus/kservePerformanceMetrics';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';

type KserveRequestCountGraphProps = {
  graphDefinition: KserveMetricGraphDefinition;
  end: number;
  namespace: string;
};

const KserveRequestCountGraph: React.FC<KserveRequestCountGraphProps> = ({
  graphDefinition,
  end,
  namespace,
}) => {
  const {
    data: { successCount, failedCount },
  } = useFetchKserveRequestCountData(graphDefinition, end, namespace);

  return (
    <MetricsChart
      metrics={[
        {
          name: 'Successful',
          metric: successCount,
        },
        {
          name: 'Failed',
          metric: failedCount,
        },
      ]}
      color="blue"
      title={graphDefinition.title}
      isStack
    />
  );
};

export default KserveRequestCountGraph;
