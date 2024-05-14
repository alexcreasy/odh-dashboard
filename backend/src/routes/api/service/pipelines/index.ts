import { DSPipelineKind } from '../../../../types';
import { proxyService } from '../../../../utils/proxy';

export default proxyService<DSPipelineKind>(
  {
    apiGroup: 'datasciencepipelinesapplications.opendatahub.io',
    apiVersion: 'v1alpha1',
    kind: 'DataSciencepipelinesApplication',
    plural: 'datasciencepipelinesapplications',
  },
  {
    port: 8888,
    prefix: 'ds-pipeline-',
  },
  {
    // Use port forwarding for local development:
    // kubectl port-forward -n <namespace> svc/ds-pipeline-pipelines-definition 8888:8888
    host: process.env.DS_PIPELINE_DSPA_SERVICE_HOST,
    port: process.env.DS_PIPELINE_DSPA_SERVICE_PORT,
  },
  (resource) =>
    !!resource.status?.conditions?.find((c) => c.type === 'APIServerReady' && c.status === 'True'),
  false,
);
