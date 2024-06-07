import React from 'react';
import {
  KserveMetricGraphDefinition,
  KserveMetricsConfigMapKind,
  KserveMetricsDataObject,
} from '~/concepts/metrics/kserve/types';

const useKserveMetricsGraphDefinitions = (
  kserveMetricsConfigMap: KserveMetricsConfigMapKind | null,
): KserveMetricGraphDefinition[] =>
  React.useMemo(() => {
    if (kserveMetricsConfigMap && kserveMetricsConfigMap.data.supported === 'true') {
      const data: KserveMetricsDataObject = JSON.parse(kserveMetricsConfigMap.data.metrics);
      return data.config;
    }
    return [];
  }, [kserveMetricsConfigMap]);

export default useKserveMetricsGraphDefinitions;
