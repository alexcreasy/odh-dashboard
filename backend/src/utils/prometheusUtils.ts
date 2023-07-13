import {
  K8sStatus,
  KubeFastifyInstance,
  OauthFastifyRequest,
  PrometheusQueryRangeResponse,
  QueryType,
} from '../types';
import { DEV_MODE } from './constants';
import { getNamespaces } from './notebookUtils';
import { getDashboardConfig } from './resourceUtils';
import { createCustomError } from './requestUtils';
import { proxyCall, ProxyError, ProxyErrorType } from './httpUtils';
import _ from 'lodash';
import { V1SelfSubjectAccessReview } from '@kubernetes/client-node';
import { safeURLPassThrough } from '../routes/api/k8s/pass-through';

const callPrometheus = async <T>(
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  query: string,
  host: string,
  queryType: QueryType,
): Promise<{ code: number; response: T }> => {
  if (!query) {
    fastify.log.warn('Prometheus call was made without a query');
    return Promise.reject({ code: 400, response: 'Failed to provide a query' });
  }

  if (!host) {
    fastify.log.warn('Prometheus call was made with a host that does not exist');
    return Promise.reject({ code: 400, response: 'Failed to find the prometheus instance host' });
  }

  const url = `${host}/api/v1/${queryType}?${query}`;

  fastify.log.info(`Prometheus query: ${query}`);
  return proxyCall(fastify, request, { method: 'GET', url, rejectUnauthorized: false })
    .then((rawData) => {
      try {
        const parsedData = JSON.parse(rawData);
        if (parsedData.status === 'error') {
          throw { code: 400, response: parsedData.error };
        }
        fastify.log.info('Successful response from Prometheus.');
        return { code: 200, response: parsedData };
      } catch (e) {
        const errorMessage = e.message || e.toString();
        fastify.log.error(`Failure parsing the response from Prometheus: ${errorMessage}`);
        fastify.log.error(`Unparsed Prometheus data: ${rawData}`);
        if (errorMessage.includes('Unexpected token < in JSON')) {
          throw { code: 422, response: 'Unprocessable prometheus response' };
        }
        throw { code: 500, response: rawData };
      }
    })
    .catch((error) => {
      let errorMessage = 'Unknown error';
      if (error instanceof ProxyError) {
        errorMessage = error.message || errorMessage;
        switch (error.proxyErrorType) {
          case ProxyErrorType.HTTP_FAILURE:
            fastify.log.error(`Failure calling Prometheus. ${errorMessage}`);
            throw { code: 500, response: `Cannot fetch prometheus data, ${errorMessage}` };
          default:
          // unhandled type, fall-through
        }
      } else if (!(error instanceof Error)) {
        errorMessage = JSON.stringify(error);
      }

      fastify.log.error(`Unhandled error during prometheus call: ${errorMessage}`);
      throw error;
    });
};

const generatePrometheusHostURL = (
  fastify: KubeFastifyInstance,
  instanceName: string,
  namespace: string,
  port: string,
): string => {
  if (DEV_MODE) {
    const apiPath = fastify.kube.config.getCurrentCluster().server;
    const namedHost = apiPath.slice('https://api.'.length).split(':')[0];
    return `https://${instanceName}-${namespace}.apps.${namedHost}`;
  }
  return `https://${instanceName}.${namespace}.svc.cluster.local:${port}`;
};

export const callPrometheusThanos = <T>(
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  query: string,
  queryType: QueryType = QueryType.QUERY,
): Promise<{ code: number; response: T }> =>
  callPrometheus<T>(
    fastify,
    request,
    query,
    generatePrometheusHostURL(fastify, 'thanos-querier', 'openshift-monitoring', '9092'),
    queryType,
  );

export const callPrometheusServing = (
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  query: string,
): Promise<{ code: number; response: PrometheusQueryRangeResponse | undefined }> => {
  const { dashboardNamespace } = getNamespaces(fastify);

  const modelMetricsNamespace = getDashboardConfig().spec.dashboardConfig.modelMetricsNamespace;

  if (dashboardNamespace !== 'redhat-ods-applications' && modelMetricsNamespace) {
    return callPrometheus(
      fastify,
      request,
      query,
      generatePrometheusHostURL(fastify, 'odh-model-monitoring', modelMetricsNamespace, '443'),
      QueryType.QUERY_RANGE,
    );
  }

  if (dashboardNamespace === 'redhat-ods-applications' && !modelMetricsNamespace) {
    return callPrometheus(
      fastify,
      request,
      query,
      generatePrometheusHostURL(fastify, 'rhods-model-monitoring', 'redhat-ods-monitoring', '443'),
      QueryType.QUERY_RANGE,
    );
  }

  throw createCustomError(
    'Service Unavailable',
    'Service Prometheus is down or misconfigured',
    503,
  );
};

const invalidInputError = createCustomError(
  'Bad Request',
  'One or more supplied request parameters are invalid',
  400,
);
const forbiddenError = createCustomError(
  'Forbidden',
  'The user does not have permission to access this resource',
  403,
);

export const callPrometheusBiasSPD = (
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  namespace: string,
  model: string,
  start: string,
  end: string,
  step: string,
): Promise<{ code: number; response: PrometheusQueryRangeResponse | undefined }> => {
  if (_.isEmpty(namespace)) {
    return Promise.reject(invalidInputError);
  }

  if (_.isEmpty(model)) {
    return Promise.reject(invalidInputError);
  }

  if (!isValidNumber(start)) {
    return Promise.reject(invalidInputError);
  }

  if (!isValidNumber(end)) {
    return Promise.reject(invalidInputError);
  }

  if (!isValidNumber(step)) {
    return Promise.reject(invalidInputError);
  }

  //trustyai_spd{model="${name}"}

  const query = `trustyai_spd{namespace=\\"${namespace}\\",model=\\"${model}\\"}&start=${start}&end=${end}&step=${step}`;

  //request.headers.authorization = `Bearer ${fastify.kube.currentToken}`;

  return callPrometheusServing(fastify, request, query);

  //return Promise.resolve({ code: 200, response: undefined });
};

const isValidNumber = (value: any): boolean => {
  return Number.isFinite(parseFloat(value));
};

export const checkInferenceServicePermission = (
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  namespace: string,
  name: string,
): Promise<V1SelfSubjectAccessReview | K8sStatus> => {
  const kc = fastify.kube.config;
  const cluster = kc.getCurrentCluster();
  const selfSubjectAccessReviewObject: V1SelfSubjectAccessReview = {
    apiVersion: 'authorization.k8s.io/v1',
    kind: 'SelfSubjectAccessReview',
    spec: {
      resourceAttributes: {
        group: 'serving.kserve.io',
        resource: 'inferenceservices',
        subresource: '',
        verb: 'get',
        name,
        namespace,
      },
    },
  };
  return safeURLPassThrough<V1SelfSubjectAccessReview>(fastify, request, {
    url: `${cluster.server}/apis/authorization.k8s.io/v1/selfsubjectaccessreviews`,
    method: 'POST',
    requestData: JSON.stringify(selfSubjectAccessReviewObject),
  });
};
