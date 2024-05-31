import React from 'react';
import {
  KserveMetricGraphDefinition,
  KserveMetricsConfigMapKind,
  KserveMetricsDataObject,
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
      const data: KserveMetricsDataObject = JSON.parse(kserveMetricsConfigMap.data.metrics);
      return data.data;
    }
    return [];
  }, [kserveMetricsConfigMap]);

export default useKserveMetricsGraphDefinitions;
