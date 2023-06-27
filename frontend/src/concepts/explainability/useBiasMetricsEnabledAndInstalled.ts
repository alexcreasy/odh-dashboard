import React from 'react';
import useBiasMetricsEnabled from '~/concepts/explainability/useBiasMetricsEnabled';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';

const useBiasMetricsEnabledAndInstalled = () => {
  const { hasCR } = React.useContext(ExplainabilityContext);
  const [enabled] = useBiasMetricsEnabled();

  return [enabled && hasCR];
};

export default useBiasMetricsEnabledAndInstalled;
