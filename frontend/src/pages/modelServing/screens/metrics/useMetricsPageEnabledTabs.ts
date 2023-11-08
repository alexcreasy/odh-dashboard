import useIsTrustyAIAvailable from '~/concepts/explainability/useIsTrustyAIAvailable';
import { MetricsTabKeys } from './types';
import usePerformanceMetricsEnabled from './usePerformanceMetricsEnabled';

const useMetricsPageEnabledTabs = () => {
  const enabledTabs: MetricsTabKeys[] = [];
  const [biasMetricsEnabled] = useIsTrustyAIAvailable();
  const [performanceMetricsEnabled] = usePerformanceMetricsEnabled();
  if (performanceMetricsEnabled) {
    enabledTabs.push(MetricsTabKeys.PERFORMANCE);
  }
  if (biasMetricsEnabled) {
    enabledTabs.push(MetricsTabKeys.BIAS);
  }
  return enabledTabs;
};

export default useMetricsPageEnabledTabs;
