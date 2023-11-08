import React from 'react';
import useIsTrustyAIAvailable from '~/concepts/explainability/useIsTrustyAIAvailable';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';

const useBiasMetricsInstalled = () => {
  const [biasMetricsEnabled] = useIsTrustyAIAvailable();
  const { hasCR } = React.useContext(ExplainabilityContext);

  return [biasMetricsEnabled && hasCR];
};

export default useBiasMetricsInstalled;
