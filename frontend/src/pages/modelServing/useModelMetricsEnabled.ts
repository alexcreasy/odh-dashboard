import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import { KnownLabels, ProjectKind } from '~/k8sTypes';

const useModelMetricsEnabled = (currentProject: ProjectKind): [modelMetricsEnabled: boolean] => {
  const performanceMetricsAreaAvailable = useIsAreaAvailable(
    SupportedArea.PERFORMANCE_METRICS,
  ).status;
  const biasMetricsAreaAvailable = useIsAreaAvailable(SupportedArea.BIAS_METRICS).status;

  const modelMeshEnabled =
    currentProject.metadata.labels?.[KnownLabels.MODEL_SERVING_PROJECT] === 'true';

  const checkModelMetricsEnabled = () =>
    modelMeshEnabled && (performanceMetricsAreaAvailable || biasMetricsAreaAvailable);

  return [checkModelMetricsEnabled()];
};

export default useModelMetricsEnabled;
