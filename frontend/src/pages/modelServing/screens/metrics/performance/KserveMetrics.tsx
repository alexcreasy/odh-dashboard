import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  PageSectionVariants,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { EmptyStateBasic } from '@patternfly/react-core/src/components/EmptyState/examples/EmptyStateBasic';
import { CubesIcon } from '@patternfly/react-icons';
import { ModelServingMetricsContext } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import useKserveMetricsConfigMap from '~/concepts/metrics/kserve/useKserveMetricsConfigMap';
import useKserveMetricsGraphDefinitions from '~/concepts/metrics/kserve/useKserveMetricsGraphDefinitions';
import KservePerformanceGraphs from '~/concepts/metrics/kserve/content/KservePerformanceGraphs';
import UnknownError from '~/pages/UnknownError';
import { MetricsCommonContext } from '~/concepts/metrics/MetricsCommonContext';
import useRefreshInterval from '~/utilities/useRefreshInterval';
import { RefreshIntervalValue } from '~/concepts/metrics/const';

type KserveMetricsProps = {
  modelName: string;
};

const KserveMetrics: React.FC<KserveMetricsProps> = ({ modelName }) => {
  const { namespace } = React.useContext(ModelServingMetricsContext);
  const { currentTimeframe, currentRefreshInterval, lastUpdateTime, setLastUpdateTime } =
    React.useContext(MetricsCommonContext);
  const [configMap, configMapLoaded, configMapError] = useKserveMetricsConfigMap(
    namespace,
    modelName,
  );
  const {
    graphDefinitions,
    error: graphDefinitionsError,
    loaded: graphDefinitionsLoaded,
    supported,
  } = useKserveMetricsGraphDefinitions(configMap);

  const loaded = configMapLoaded && graphDefinitionsLoaded;

  const refreshAllMetrics = React.useCallback(() => {
    setLastUpdateTime(Date.now());
  }, [setLastUpdateTime]);

  useRefreshInterval(RefreshIntervalValue[currentRefreshInterval], refreshAllMetrics);

  if (configMapError) {
    return (
      <UnknownError
        titleText="Error retrieving metric configurations"
        error={configMapError}
        variant={PageSectionVariants.light}
        testId="kserve-configmap-error"
      />
    );
  }

  if (graphDefinitionsError) {
    return (
      <UnknownError
        titleText="Error loading metric configuration"
        error={graphDefinitionsError}
        variant={PageSectionVariants.light}
        testId="kserve-invalid-definition-error"
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!supported) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg" data-testid="kserve-metrics-runtime-unsupported">
          Metrics are unsupported for this serving runtime.
        </Title>
      </EmptyState>
    );
  }

  return (
    <KservePerformanceGraphs
      namespace={namespace}
      timeframe={currentTimeframe}
      end={lastUpdateTime}
      graphDefinitions={graphDefinitions}
    />
  );
};

export default KserveMetrics;
