import { useParams } from 'react-router-dom';
import React from 'react';
import { BiasMetricConfig } from '~/concepts/explainability/types';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';
import { GetInfoResponse } from '~/api';

export type ExplainabilityModelData = {
  biasMetricConfigs: BiasMetricConfig[];
  biasMetricMetadata: GetInfoResponse;
  loaded: boolean;
  refresh: () => Promise<unknown>;
};
export const useExplainabilityModelData = (): ExplainabilityModelData => {
  const { inferenceService } = useParams();

  const { data } = React.useContext(ExplainabilityContext);

  const [biasMetricConfigs, biasMetricMetadata] = React.useMemo(() => {
    let configs: BiasMetricConfig[] = [];
    let meta: GetInfoResponse = [];

    if (data.loaded) {
      configs = data.biasMetricConfigs.filter((x) => x.modelId === inferenceService);
      meta = data.biasMetricMetadata.filter((x) => x.data.modelId === inferenceService);
    }

    return [configs, meta];
  }, [data.biasMetricConfigs, data.biasMetricMetadata, data.loaded, inferenceService]);

  return {
    biasMetricConfigs,
    biasMetricMetadata,
    loaded: data.loaded,
    refresh: data.refresh,
  };
};
