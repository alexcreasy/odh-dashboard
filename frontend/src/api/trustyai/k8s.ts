import { k8sGetResource, K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sAPIOptions, RouteKind, TrustyAiKind } from '~/k8sTypes';
import { getRoute } from '~/api';
import { TRUSTYAI_ROUTE_NAME } from '~/concepts/explainability/const';
import { applyK8sAPIOptions } from '~/api/apiMergeUtils';

//TODO: find proper home for this
export const TrustyAIApplicationsModel: K8sModelCommon = {
  apiVersion: 'v1',
  apiGroup: 'trustyai.opendatahub.io.trusty.opendatahub.io',
  kind: 'TrustyAIService',
  plural: 'trustyai',
};

//TODO: find proper home for this
export const TRUSTYAI_DEFINITION_NAME = 'trustyai-service';

export const getTrustyAIAPIRoute = async (
  namespace: string,
  opts?: K8sAPIOptions,
): Promise<RouteKind> => getRoute(TRUSTYAI_ROUTE_NAME, namespace, opts);

export const getTrustyAICR = async (
  namespace: string,
  opts?: K8sAPIOptions,
): Promise<TrustyAiKind> =>
  k8sGetResource<TrustyAiKind>(
    applyK8sAPIOptions(opts, {
      model: TrustyAIApplicationsModel,
      queryOptions: { name: TRUSTYAI_DEFINITION_NAME, ns: namespace },
    }),
  );
