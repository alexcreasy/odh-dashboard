import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useBiasMetricsEnabled = () => {
  const { status, featureFlags } = useIsAreaAvailable(SupportedArea.TRUSTY_AI);

  return status && featureFlags?.disableBiasMetrics === 'on';
};

export default useBiasMetricsEnabled;
