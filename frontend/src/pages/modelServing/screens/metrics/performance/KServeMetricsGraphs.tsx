import { EmptyState, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import { PendingIcon } from '@patternfly/react-icons';
import React from 'react';
import useKserveMetricsConfigMap from '~/concepts/metrics/kserve/useKserveMetricsConfigMap';
import useKserveMetricsGraphDefinitions from '~/concepts/metrics/kserve/useKserveMetricsGraphDefinitions';

const KServeMetricsGraphs: React.FC = () => {
  //const {} = React.useContext(ModelServingMetricsContext);

  // const [configMap, setConfigMap] = React.useState<ConfigMapKind>();
  //
  // React.useEffect(() => {
  //   getKserveMetricsConfigMap('kserve', 'demo').then((x) => {
  //     // @ts-ignore
  //     console.log('config: %O', JSON.parse(x.data.Data));
  //     setConfigMap(x);
  //   });
  // }, []);

  // const data = React.useMemo<any[]>(() => {
  //   if (configMap?.data?.config) {
  //     return JSON.parse(configMap.data.config);
  //   }
  //   return null;
  // }, [configMap]);

  // const configMap = React.useMemo(() => {
  //   getKserveMetricsConfigMap('kserve', 'ovms');
  // }, []);

  const [configMap, loaded, error, refresh] = useKserveMetricsConfigMap('kserve', 'kserve');

  const chartDefinitions = useKserveMetricsGraphDefinitions(configMap);

  if (chartDefinitions.length === 0) {
    return (
      <EmptyState variant="full" data-testid="kserve-metrics-page">
        <EmptyStateHeader
          titleText="Single-model serving platform model metrics coming soon."
          headingLevel="h4"
          icon={<EmptyStateIcon icon={PendingIcon} />}
          alt=""
        />
      </EmptyState>
    );
  }

  return (
    <>
      <code>
        {chartDefinitions.map((chartDef) => (
          <p key={`${chartDef.title}${chartDef.type}`}>{chartDef.title}</p>
        ))}
      </code>
    </>
  );
};

export default KServeMetricsGraphs;
