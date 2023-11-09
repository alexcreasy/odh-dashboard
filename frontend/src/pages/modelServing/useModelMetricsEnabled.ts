import useBiasMetricsEnabled from '~/concepts/explainability/useBiasMetricsEnabled';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useModelMetricsEnabled = (): [modelMetricsEnabled: boolean] => {
  const performanceMetricsAreaAvailable = useIsAreaAvailable(
    SupportedArea.PERFORMANCE_METRICS,
  ).status;
  const biasMetricsEnabled = useBiasMetricsEnabled();

  const checkModelMetricsEnabled = () => performanceMetricsAreaAvailable || biasMetricsEnabled;

  return [checkModelMetricsEnabled()];
};

export default useModelMetricsEnabled;
