import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const usePerformanceMetricsEnabled = () => {
  const { status } = useIsAreaAvailable(SupportedArea.PERFORMANCE_METRICS);

  return [status];
};

export default usePerformanceMetricsEnabled;
