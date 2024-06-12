import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  PageSectionVariants,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { MetricsCommonContext } from '~/concepts/metrics/MetricsCommonContext';
import useKserveMetricsConfigMap from '~/concepts/metrics/kserve/useKserveMetricsConfigMap';
import useKserveMetricsGraphDefinitions from '~/concepts/metrics/kserve/useKserveMetricsGraphDefinitions';
import useRefreshInterval from '~/utilities/useRefreshInterval';
import { RefreshIntervalValue } from '~/concepts/metrics/const';
import UnknownError from '~/pages/UnknownError';
import { RefreshIntervalTitle, TimeframeTitle } from '~/concepts/metrics/types';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';

type KserveMetricsContextProps = {
  namespace: string;
  timeframe: TimeframeTitle;
  refreshInterval: RefreshIntervalTitle;
  lastUpdateTime: number;
  graphDefinitions: KserveMetricGraphDefinition[];
};

export const KserveMetricsContext = React.createContext<KserveMetricsContextProps>({
  namespace: '',
  timeframe: TimeframeTitle.ONE_DAY,
  refreshInterval: RefreshIntervalTitle.FIVE_MINUTES,
  lastUpdateTime: 0,
  graphDefinitions: [],
});

type KserveMetricsContextProviderProps = {
  children: React.ReactNode;
  namespace: string;
  modelName: string;
};

export const KserveMetricsContextProvider: React.FC<KserveMetricsContextProviderProps> = ({
  children,
  namespace,
  modelName,
}) => {
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

  const contextValue = React.useMemo(
    () => ({
      namespace,
      lastUpdateTime,
      refreshInterval: currentRefreshInterval,
      timeframe: currentTimeframe,
      graphDefinitions,
    }),
    [currentRefreshInterval, currentTimeframe, graphDefinitions, lastUpdateTime, namespace],
  );

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
    <KserveMetricsContext.Provider value={contextValue}>{children}</KserveMetricsContext.Provider>
  );
};
