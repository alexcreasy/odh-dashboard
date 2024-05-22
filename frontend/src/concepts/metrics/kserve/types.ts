import { ConfigMapKind } from '~/k8sTypes';
import { KSERVE_METRICS_GRAPH_TYPES } from '~/concepts/metrics/kserve/const';

export type KserveMetricsConfigMapKind = ConfigMapKind & {
  data: {
    supported: 'true' | 'false';
    config: string;
  };
};

export type KserveMetricGraphDefinition = {
  title: string;
  type: KSERVE_METRICS_GRAPH_TYPES;
  queries: [
    {
      title: string;
      query: string;
    },
  ];
};
