import { k8sGetResource, K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sAPIOptions, RouteKind, TrustyAiKind } from '~/k8sTypes';
import { getRoute } from '~/api';
import { TRUSTYAI_ROUTE_NAME } from '~/concepts/explainability/const';
import { applyK8sAPIOptions } from '~/api/apiMergeUtils';

//TODO: find proper home for this
export const TrustyAIApplicationsModel: K8sModelCommon = {
  apiVersion: 'v1alpha1',
  apiGroup: 'trustyai.opendatahub.io.trustyai.opendatahub.io',
  kind: 'TrustyAIService',
  plural: 'trustyaiservices',
};

//TODO: find proper home for this
export const TRUSTYAI_DEFINITION_NAME = 'trustyaiservices';

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
      queryOptions: { ns: namespace },
    }),
  );
