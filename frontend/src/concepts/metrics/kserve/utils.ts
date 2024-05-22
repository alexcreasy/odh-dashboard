import { ConfigMapKind } from '~/k8sTypes';
import { KserveMetricsConfigMapKind } from '~/concepts/metrics/kserve/types';

export const isKserveMetricsConfigMapKind = (
  configMapKind: ConfigMapKind,
): configMapKind is KserveMetricsConfigMapKind =>
  (configMapKind as KserveMetricsConfigMapKind).data.supported === 'true' ||
  (configMapKind as KserveMetricsConfigMapKind).data.supported === 'false';
