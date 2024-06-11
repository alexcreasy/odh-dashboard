import React from 'react';
import {
  KserveMetricsConfigMapKind,
  KserveMetricsDefinition,
} from '~/concepts/metrics/kserve/types';

const useKserveMetricsGraphDefinitions = (
  kserveMetricsConfigMap: KserveMetricsConfigMapKind | null,
): KserveMetricsDefinition =>
  React.useMemo(() => {
    const result: KserveMetricsDefinition = {
      supported: false,
      loaded: !!kserveMetricsConfigMap,
      graphDefinitions: [],
    };

    if (kserveMetricsConfigMap) {
      result.supported = kserveMetricsConfigMap.data.supported === 'true';

      if (result.supported) {
        try {
          result.graphDefinitions = JSON.parse(kserveMetricsConfigMap.data.metrics).config;
        } catch (e) {
          if (e instanceof Error) {
            result.error = e;
          } else {
            result.error = new Error('Unable to parse graphDefinition');
          }
        }
      }
    }
    return result;
  }, [kserveMetricsConfigMap]);

export default useKserveMetricsGraphDefinitions;
