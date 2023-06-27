import * as React from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProjectsRoutes from '~/concepts/projects/ProjectsRoutes';
import useBiasMetricsEnabled from '~/concepts/explainability/useBiasMetricsEnabled';
import ModelServingExplainabilityWrapper from '~/pages/modelServing/screens/metrics/ModelServingExplainabilityWrapper';
import BiasConfigurationBreadcrumbPage from './screens/metrics/BiasConfigurationBreadcrumbPage';
import GlobalInferenceMetricsPage from './screens/metrics/GlobalInferenceMetricsPage';
import ModelServingContextProvider from './ModelServingContext';
import GlobalInferenceMetricsWrapper from './screens/metrics/GlobalInferenceMetricsWrapper';
import ModelServingGlobal from './screens/global/ModelServingGlobal';
import useModelMetricsEnabled from './useModelMetricsEnabled';

const ModelServingRoutes: React.FC = () => {
  const [modelMetricsEnabled] = useModelMetricsEnabled();
  const [biasMetricsEnabled] = useBiasMetricsEnabled();

  //TODO: Split route to project and mount provider here. This will allow you to load data when model switching is later implemented.
  return (
    <ProjectsRoutes>
      <Route path="/" element={<ModelServingContextProvider />}>
        <Route index element={<ModelServingGlobal />} />
        {modelMetricsEnabled && (
          <Route path="/metrics/:project" element={<ModelServingExplainabilityWrapper />}>
            <Route index element={<Navigate to=".." />} />
            <Route path=":inferenceService" element={<GlobalInferenceMetricsWrapper />}>
              <Route path=":tab?" element={<GlobalInferenceMetricsPage />} />
              {biasMetricsEnabled && (
                <Route path="configure" element={<BiasConfigurationBreadcrumbPage />} />
              )}
            </Route>
            {/* TODO: Global Runtime metrics?? */}
            <Route path="*" element={<Navigate to="." />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="." />} />
      </Route>
    </ProjectsRoutes>
  );
};

export default ModelServingRoutes;
