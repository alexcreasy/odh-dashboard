import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useBiasMetricsEnabled = () => {
  const { status, featureFlags } = useIsAreaAvailable(SupportedArea.BIAS_METRICS);

  return status && featureFlags?.disableBiasMetrics === 'on';
};

export default useBiasMetricsEnabled;
