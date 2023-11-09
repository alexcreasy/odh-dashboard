import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useBiasMetricsEnabled = () => [useIsAreaAvailable(SupportedArea.TRUSTY_AI).status];

export default useBiasMetricsEnabled;
