import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useBiasMetricsEnabled = () => {
  const { status, featureFlags } = useIsAreaAvailable(SupportedArea.TRUSTY_AI);

  const enabled = status && featureFlags?.disableBiasMetrics === 'on';

  return [enabled];
};

export default useBiasMetricsEnabled;
