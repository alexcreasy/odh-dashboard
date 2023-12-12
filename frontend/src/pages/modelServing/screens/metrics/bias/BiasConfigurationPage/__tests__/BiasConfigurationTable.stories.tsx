import BiasConfigurationTable, {
  BiasConfigurationTableProps,
} from '~/pages/modelServing/screens/metrics/bias/BiasConfigurationPage/BiasConfigurationTable';
import { mockInferenceServiceK8sResource } from '~/__mocks__/mockInferenceServiceK8sResource';
import { InferenceServiceKind } from '~/k8sTypes';
import { BiasMetricConfig } from '~/concepts/trustyai/types';
import { BiasMetricType } from '~/api';

export default {
  component: BiasConfigurationTable,
  title: 'BiasConfigurationTable',
  tags: ['autodocs'],
};

const mockBiasMetricConfigs: BiasMetricConfig[] = [
  {
    id: 'test_id_1',
    name: 'test_name_1',
    metricType: BiasMetricType.SPD,
    protectedAttribute: 'test_protected_attribute_1',
    outcomeName: 'test_outcome_name_1',
    favorableOutcome: 'test_favorable_outcome_1',
    privilegedAttribute: 'privileged_attribute_1',
    unprivilegedAttribute: 'unprivileged_attribute_1',
    modelId: 'model_id_1',
    thresholdDelta: 0.5,
    batchSize: 5000,
  },
];

const defaultArgs: BiasConfigurationTableProps = {
  inferenceService: mockInferenceServiceK8sResource as unknown as InferenceServiceKind,
  onConfigure: () => {
    // do something
    console.log('onConfigure was called');
  },
  refresh: () => {
    // do something
    console.log('refresh was called');
  },
  biasMetricConfigs: mockBiasMetricConfigs,
};

export const Default = {
  args: defaultArgs,
};
