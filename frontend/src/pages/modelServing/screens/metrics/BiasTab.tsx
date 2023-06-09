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
import TrustyChart, { TrustyChartProps } from '~/pages/modelServing/screens/metrics/TrustyChart';
import { DomainCalculator } from '~/pages/modelServing/screens/metrics/types';
import { MetricTypes } from '~/api';
import BiasMetricChartWrapper from '~/pages/modelServing/screens/metrics/BiasMetricChartWrapper';
import { useBrowserStorage } from '~/components/browserStorage';
import EmptyBiasConfigurationCard from '~/pages/modelServing/screens/metrics/EmptyBiasConfigurationCard';
import EmptyBiasChartSelectionCard from '~/pages/modelServing/screens/metrics/EmptyBiasChartSelectionCard';
import { BIAS_THRESHOLD_PADDING } from '~/pages/modelServing/screens/metrics/const';

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

  const charts = React.useMemo(() => selectedBiasConfigs.map(asChartData), [selectedBiasConfigs]);

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
                {charts.map((chart) => (
                  <StackItem key={chart.id}>
                    <BiasMetricChartWrapper
                      title={chart.name}
                      storageKey={`${OPEN_WRAPPER_STORAGE_KEY_PREFIX}-${chart.id}`}
                    >
                      <TrustyChart
                        id={chart.id}
                        title={chart.title}
                        abbreviation={chart.abbreviation}
                        metricType={chart.metricType}
                        domain={chart.domain}
                        biasMetricConfig={chart.biasMetricConfig}
                      />
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

type ChartData = {
  name: string;
  id: string;
  biasMetricConfig: BiasMetricConfig;
} & TrustyChartProps;

//TODO: Add separate domain calcs.
const asChartData = (biasMetricConfig: BiasMetricConfig): ChartData => {
  const { id, name } = biasMetricConfig;
  const domain: DomainCalculator = (maxYValue, minYValue) => ({
    y: [maxYValue + BIAS_THRESHOLD_PADDING, minYValue - BIAS_THRESHOLD_PADDING],
    // maxYValue > DEFAULT_MAX_THRESHOLD
    //   ? [-1 * maxYValue - PADDING, maxYValue + PADDING]
    //   : [DEFAULT_MIN_THRESHOLD - PADDING, DEFAULT_MAX_THRESHOLD + PADDING],
  });

  let title = '';
  let abbreviation = 'DEFAULT';

  if (biasMetricConfig.metricType === MetricTypes.SPD) {
    title = 'Statistical Parity Difference';
    abbreviation = 'SPD';
  } else if (biasMetricConfig.metricType === MetricTypes.DIR) {
    title = 'Disparate Impact Ratio';
    abbreviation = 'DIR';
  }

  return {
    id,
    name,
    title,
    abbreviation,
    domain,
    biasMetricConfig,
  };
};
export default BiasTab;
