import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';

type KservePerformanceGraphsProps = {
  namespace: string;
  modelName: string;
  graphDefinitions: KserveMetricGraphDefinition[];
};

const kservePerformanceGraphs: React.FC<KservePerformanceGraphsProps> = ({
  namespace,
  modelName,
  graphDefinitions,
}) => {};

export default kservePerformanceGraphs;
