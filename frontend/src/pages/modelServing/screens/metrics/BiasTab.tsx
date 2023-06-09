import React from 'react';
import {
  Bullseye,
  PageSection,
  Spinner,
  Stack,
  StackItem,
  ToolbarItem,
} from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import MetricsPageToolbar from '~/pages/modelServing/screens/metrics/MetricsPageToolbar';
import BiasMetricConfigSelector from '~/pages/modelServing/screens/metrics/BiasMetricConfigSelector';
import { BiasMetricConfig } from '~/concepts/explainability/types';
import { useExplainabilityModelData } from '~/concepts/explainability/useExplainabilityModelData';
import TrustyChart from '~/pages/modelServing/screens/metrics/TrustyChart';
import BiasMetricChartWrapper from '~/pages/modelServing/screens/metrics/BiasMetricChartWrapper';
import { useBrowserStorage } from '~/components/browserStorage';
import EmptyBiasConfigurationCard from '~/pages/modelServing/screens/metrics/EmptyBiasConfigurationCard';
import EmptyBiasChartSelectionCard from '~/pages/modelServing/screens/metrics/EmptyBiasChartSelectionCard';

const SELECTED_CHARTS_STORAGE_KEY_PREFIX = 'odh.dashboard.xai.selected_bias_charts';
const OPEN_WRAPPER_STORAGE_KEY_PREFIX = `odh.dashboard.xai.bias_metric_chart_wrapper_open`;
const BiasTab: React.FC = () => {
  const { inferenceService } = useParams();

  const { biasMetricConfigs, loaded } = useExplainabilityModelData();

  const [selectedBiasConfigs, setSelectedBiasConfigs] = useBrowserStorage<BiasMetricConfig[]>(
    `${SELECTED_CHARTS_STORAGE_KEY_PREFIX}-${inferenceService}`,
    [],
    true,
    true,
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <Stack>
      <StackItem>
        <MetricsPageToolbar
          leftToolbarItem={
            <ToolbarItem>
              <ToolbarItem variant="label">Metrics to display</ToolbarItem>
              <ToolbarItem>
                <BiasMetricConfigSelector
                  onChange={setSelectedBiasConfigs}
                  initialSelections={selectedBiasConfigs}
                />
              </ToolbarItem>
            </ToolbarItem>
          }
        />
      </StackItem>
      <PageSection isFilled>
        <Stack hasGutter>
          {(biasMetricConfigs.length === 0 && (
            <StackItem>
              <EmptyBiasConfigurationCard />
            </StackItem>
          )) ||
            (selectedBiasConfigs.length === 0 && (
              <StackItem>
                <EmptyBiasChartSelectionCard />
              </StackItem>
            )) || (
              <>
                {biasMetricConfigs.map((x) => (
                  <StackItem key={x.id}>
                    <BiasMetricChartWrapper
                      title={x.name}
                      storageKey={`${OPEN_WRAPPER_STORAGE_KEY_PREFIX}-${x.id}`}
                    >
                      <TrustyChart biasMetricConfig={x} />
                    </BiasMetricChartWrapper>
                  </StackItem>
                ))}
              </>
            )}
        </Stack>
      </PageSection>
    </Stack>
  );
};
export default BiasTab;
