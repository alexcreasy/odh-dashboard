import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Spinner,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import React from 'react';
import useKserveMetricsConfigMap from '~/concepts/metrics/kserve/useKserveMetricsConfigMap';
import useKserveMetricsGraphDefinitions from '~/concepts/metrics/kserve/useKserveMetricsGraphDefinitions';
import KservePerformanceGraphs from '~/concepts/metrics/kserve/content/KservePerformanceGraphs';
import { ModelServingMetricsContext } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';

type KServeMetricsGraphsProps = {
  modelName: string;
};

const KServeMetricsGraphs: React.FC<KServeMetricsGraphsProps> = ({ modelName }) => {
  const { namespace } = React.useContext(ModelServingMetricsContext);
  const [configMap, loaded, error] = useKserveMetricsConfigMap(namespace, modelName);

  const chartDefinitions = useKserveMetricsGraphDefinitions(configMap);

  if (error) {
    return (
      <EmptyState variant={EmptyStateVariant.lg}>
        <EmptyStateHeader
          titleText="Error"
          icon={<EmptyStateIcon icon={ErrorCircleOIcon} />}
          headingLevel="h5"
        />
        <EmptyStateBody>{error.message}</EmptyStateBody>
      </EmptyState>
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <KservePerformanceGraphs
      namespace={namespace}
      modelName={modelName}
      graphDefinitions={chartDefinitions}
    />
  );
};

export default KServeMetricsGraphs;
