import useBiasMetricsEnabled from '~/concepts/explainability/useBiasMetricsEnabled';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import { MetricsTabKeys } from './types';

const useMetricsPageEnabledTabs = () => {
  const enabledTabs: MetricsTabKeys[] = [];
  const [biasMetricsEnabled] = useBiasMetricsEnabled();
  const performanceMetricsAreaAvailable = useIsAreaAvailable(
    SupportedArea.PERFORMANCE_METRICS,
  ).status;
  if (performanceMetricsAreaAvailable) {
    enabledTabs.push(MetricsTabKeys.PERFORMANCE);
  }
  if (biasMetricsEnabled) {
    enabledTabs.push(MetricsTabKeys.BIAS);
  }
  return enabledTabs;
};

export default useMetricsPageEnabledTabs;
