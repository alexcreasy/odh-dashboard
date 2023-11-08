import useIsTrustyAIAvailable from '~/concepts/explainability/useIsTrustyAIAvailable';
import usePerformanceMetricsEnabled from './screens/metrics/usePerformanceMetricsEnabled';

const useModelMetricsEnabled = (): [modelMetricsEnabled: boolean] => {
  const [performanceMetricsEnabled] = usePerformanceMetricsEnabled();
  const [biasMetricsEnabled] = useIsTrustyAIAvailable();

  const checkModelMetricsEnabled = () => performanceMetricsEnabled || biasMetricsEnabled;

  return [checkModelMetricsEnabled()];
};

export default useModelMetricsEnabled;
