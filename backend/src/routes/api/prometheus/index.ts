import createError from 'http-errors';
import {
  KubeFastifyInstance,
  OauthFastifyRequest,
  PrometheusQueryRangeResponse,
  PrometheusQueryResponse,
  QueryType,
} from '../../../types';
import {
  callPrometheusBiasSPD,
  callPrometheusThanos,
  checkInferenceServicePermission,
} from '../../../utils/prometheusUtils';
import { createCustomError } from '../../../utils/requestUtils';
import { logRequestDetails } from '../../../utils/fileUtils';
import { getUserName } from '../../../utils/userUtils';
import { isK8sStatus } from '../k8s/pass-through';

const handleError = (e: createError.HttpError) => {
  if (e?.code) {
    throw createCustomError(
      'Error with prometheus call',
      e.response || 'Prometheus call error',
      e.code,
    );
  }
  throw e;
};

/**
 * Pass through API for getting information out of prometheus.
 * Acts on the user who made the call -- does not need route security; k8s provides that.
 */

module.exports = async (fastify: KubeFastifyInstance) => {
  fastify.post(
    '/pvc',
    async (
      request: OauthFastifyRequest<{
        Body: { query: string };
      }>,
    ): Promise<{ code: number; response: PrometheusQueryResponse }> => {
      const { query } = request.body;

      return callPrometheusThanos<PrometheusQueryResponse>(fastify, request, query).catch(
        handleError,
      );
    },
  );

  fastify.post(
    '/bias',
    async (
      request: OauthFastifyRequest<{
        Body: { query: string };
      }>,
    ): Promise<{ code: number; response: PrometheusQueryRangeResponse }> => {
      const { query } = request.body;

      return callPrometheusThanos<PrometheusQueryRangeResponse>(
        fastify,
        request,
        query,
        QueryType.QUERY_RANGE,
      ).catch(handleError);
    },
  );

  fastify.post(
    '/bias/spd/:namespace/:model',
    async (
      request: OauthFastifyRequest<{
        Params: { namespace: string; model: string };
        Querystring: Record<string, string>;
      }>,
    ): Promise<{ code: number; response: string }> => {
      logRequestDetails(fastify, request);

      const { namespace, model } = request.params;

      const { start, end, step } = request.query;

      const username = await getUserName(fastify, request);

      // const selfSubjectAccessReview = await checkNamespacePermission(fastify, request, name);
      // if (isK8sStatus(selfSubjectAccessReview)) {
      //   throw createCustomError(
      //     selfSubjectAccessReview.reason,
      //     selfSubjectAccessReview.message,
      //     selfSubjectAccessReview.code,
      //   );
      // }

      const selfSubjectAccessReview = await checkInferenceServicePermission(
        fastify,
        request,
        namespace,
        model,
      );

      fastify.log.info(`SAR: ${JSON.stringify(selfSubjectAccessReview, null, 2)}`);

      if (isK8sStatus(selfSubjectAccessReview)) {
        throw createCustomError(
          selfSubjectAccessReview.reason,
          selfSubjectAccessReview.message,
          selfSubjectAccessReview.code,
        );
      }

      if (!selfSubjectAccessReview.status.allowed) {
        fastify.log.error(
          `Unable to access the namespace, ${selfSubjectAccessReview.status.reason}`,
        );
        throw createCustomError(
          'Forbidden',
          `User does not have permission to view InferenceService: ${model}`,
          403,
        );
      }

      return {
        code: 755,
        response: `namespace: ${namespace} model: ${model} start: ${start} end: ${end} step: ${step} username: ${username}`,
      };
      // return Promise.resolve({
      //   code: 755,
      //   response: `namespace: ${namespace} model: ${model} start: ${start} end: ${end} step: ${step} username: ${username}`,
      // });
      // const { namespace, model, start, end, step } =
      //

      // request.query;
      // Params: { namespace: string; name: string }
      //return callPrometheusBiasSPD(fastify, request, namespace, model, start, end, step);

      // return callPrometheusThanos<PrometheusQueryRangeResponse>(
      //   fastify,
      //   request,
      //   query,
      //   QueryType.QUERY_RANGE,
      // ).catch(handleError);
    },
  );

  fastify.post(
    '/serving',
    async (
      request: OauthFastifyRequest<{
        Body: { query: string };
      }>,
    ): Promise<{ code: number; response: PrometheusQueryRangeResponse }> => {
      logRequestDetails(fastify, request);
      const { query } = request.body;

      return callPrometheusThanos<PrometheusQueryRangeResponse>(
        fastify,
        request,
        query,
        QueryType.QUERY_RANGE,
      ).catch(handleError);
    },
  );
};
