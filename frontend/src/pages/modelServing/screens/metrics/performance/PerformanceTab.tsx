import React from 'react';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';
import { InferenceServiceKind } from '~/k8sTypes';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import MetricsPageToolbar from '~/concepts/metrics/MetricsPageToolbar';
import { isModelMesh } from '~/pages/modelServing/utils';
import ModelGraphs from '~/pages/modelServing/screens/metrics/performance/ModelGraphs';
import { ModelMetricType } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import EnsureMetricsAvailable from '~/pages/modelServing/screens/metrics/EnsureMetricsAvailable';
import KServeMetricsGraphs from '~/pages/modelServing/screens/metrics/performance/KServeMetricsGraphs';

type PerformanceTabsProps = {
  model: InferenceServiceKind;
};

const PerformanceTab: React.FC<PerformanceTabsProps> = ({ model }) => {
  const kserve = !isModelMesh(model);
  const kserveMetricsEnabled = useIsAreaAvailable(SupportedArea.K_SERVE_METRICS).status;

  if (kserve && kserveMetricsEnabled) {
    return <KServeMetricsGraphs modelName={model.metadata.name} />;
  }

  return (
    <EnsureMetricsAvailable
      metrics={[ModelMetricType.REQUEST_COUNT_SUCCESS, ModelMetricType.REQUEST_COUNT_FAILED]}
      accessDomain="model metrics"
    >
      <Stack data-testid="performance-metrics-loaded">
        <StackItem>
          <MetricsPageToolbar />
        </StackItem>
        <PageSection isFilled>
          <ModelGraphs />
        </PageSection>
      </Stack>
    </EnsureMetricsAvailable>
  );
};

export default PerformanceTab;
