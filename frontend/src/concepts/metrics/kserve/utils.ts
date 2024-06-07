import { ConfigMapKind } from '~/k8sTypes';
import {
  KserveMetricGraphDefinition,
  KserveMetricsConfigMapKind,
} from '~/concepts/metrics/kserve/types';
import { KserveMetricsGraphTypes } from '~/concepts/metrics/kserve/const';

export const isKserveMetricsConfigMapKind = (
  configMapKind: ConfigMapKind,
): configMapKind is KserveMetricsConfigMapKind =>
  (configMapKind as KserveMetricsConfigMapKind).data.supported === 'true' ||
  (configMapKind as KserveMetricsConfigMapKind).data.supported === 'false';

export const isValidKserveRequestsGraphDefinition = (def: KserveMetricGraphDefinition): boolean => {
  if (def.type !== KserveMetricsGraphTypes.REQUEST_COUNT) {
    return false;
  }
  if (def.queries.length !== 2) {
    return false;
  }

  return true;
};
