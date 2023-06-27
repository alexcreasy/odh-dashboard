import React from 'react';
import {
  Bullseye,
  PageSection,
  Spinner,
  Stack,
  StackItem,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import MetricsPageToolbar from '~/pages/modelServing/screens/metrics/MetricsPageToolbar';
import BiasMetricConfigSelector from '~/pages/modelServing/screens/metrics/BiasMetricConfigSelector';
import { useExplainabilityModelData } from '~/concepts/explainability/useExplainabilityModelData';
import TrustyChart from '~/pages/modelServing/screens/metrics/TrustyChart';
import EmptyBiasConfigurationCard from '~/pages/modelServing/screens/metrics/EmptyBiasConfigurationCard';
import EmptyBiasChartSelectionCard from '~/pages/modelServing/screens/metrics/EmptyBiasChartSelectionCard';
import DashboardExpandableSection from '~/concepts/dashboard/DashboardExpandableSection';
import useBiasChartsBrowserStorage from '~/pages/modelServing/screens/metrics/useBiasChartsBrowserStorage';

const OPEN_WRAPPER_STORAGE_KEY_PREFIX = `odh.dashboard.xai.bias_metric_chart_wrapper_open`;
const BiasTab: React.FC = () => {
  const { biasMetricConfigs, loaded, loadError } = useExplainabilityModelData();

  const [selectedBiasConfigs, setSelectedBiasConfigs] = useBiasChartsBrowserStorage();

  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (loaded && !loadError) {
      if (firstRender.current) {
        // If the user has just navigated here AND they haven't previously selected any charts to display,
        // don't show them the "No selected" empty state, instead show them the first available chart.
        // However, the user still needs to be shown said empty state if they deselect all charts.
        firstRender.current = false;
        if (selectedBiasConfigs.length === 0 && biasMetricConfigs.length > 0) {
          // If biasMetricConfigs is empty, the "No Configured Metrics" empty state will be shown, so no need
          // to set anything.
          setSelectedBiasConfigs([biasMetricConfigs[0]]);
        }
      }
    }
  }, [loaded, biasMetricConfigs, setSelectedBiasConfigs, selectedBiasConfigs, loadError]);

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
            <ToolbarGroup>
              <Stack>
                <StackItem>
                  <ToolbarItem variant="label">Metrics to display</ToolbarItem>
                </StackItem>
                <StackItem>
                  <ToolbarItem>
                    <BiasMetricConfigSelector
                      onChange={setSelectedBiasConfigs}
                      initialSelections={selectedBiasConfigs}
                    />
                  </ToolbarItem>
                </StackItem>
              </Stack>
            </ToolbarGroup>
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
                {selectedBiasConfigs.map((x) => (
                  <StackItem key={x.id}>
                    <DashboardExpandableSection
                      title={x.name}
                      storageKey={`${OPEN_WRAPPER_STORAGE_KEY_PREFIX}-${x.id}`}
                    >
                      <TrustyChart biasMetricConfig={x} />
                    </DashboardExpandableSection>
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
