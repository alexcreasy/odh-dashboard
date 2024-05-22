import React from 'react';
import {
  KserveMetricGraphDefinition,
  KserveMetricsConfigMapKind,
} from '~/concepts/metrics/kserve/types';

const useKserveMetricsGraphDefinitions = (
  kserveMetricsConfigMap: KserveMetricsConfigMapKind | null,
): KserveMetricGraphDefinition[] =>
  //const [configMap, loaded, error, refresh] = useKserveMetricsConfigMap(namespace, modelName);
  // const graphDefinitions = React.useMemo<KserveMetricGraphDefinition[]>(() => {
  //   if (loaded && configMap && configMap.data.supported === 'true') {
  //     return JSON.parse(configMap.data.config);
  //   }
  //   return [];
  // }, [configMap, loaded]);

  React.useMemo(() => {
    if (kserveMetricsConfigMap && kserveMetricsConfigMap.data.supported === 'true') {
      return JSON.parse(kserveMetricsConfigMap.data.config);
    }
    return [];
  }, [kserveMetricsConfigMap]);

export default useKserveMetricsGraphDefinitions;
