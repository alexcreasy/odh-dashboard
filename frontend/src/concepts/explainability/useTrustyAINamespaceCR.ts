import React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
  NotReadyError,
} from '~/utilities/useFetchState';
import { TrustyAIKind } from '~/k8sTypes';
import { getTrustyAICR } from '~/api';
import { FAST_POLL_INTERVAL } from '~/utilities/const';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import { FIVE_MINUTES_MS } from '~/utilities/time';

type State = TrustyAIKind | null;

export type TrustyAINamespaceStatus = {
  state: FetchState<State>;
};

export const isTrustyCRStatusAvailable = (cr: TrustyAIKind): boolean =>
  !!cr.status?.conditions?.find((c) => c.type === 'Available' && c.status === 'True');

export const taiLoaded = ([state, loaded]: FetchState<State>): boolean =>
  loaded && !!state && isTrustyCRStatusAvailable(state);

export const taiHasServerTimedOut = (
  [state, loaded]: FetchState<State>,
  isLoaded: boolean,
): boolean => {
  if (!state || !loaded || isLoaded) {
    return false;
  }

  const createTime = state.metadata.creationTimestamp;
  if (!createTime) {
    return false;
  }
  // If we are here, and 5 mins have past, we are having issues
  return Date.now() - new Date(createTime).getTime() > FIVE_MINUTES_MS;
};

const useTrustyAINamespaceCR = (namespace: string): TrustyAINamespaceStatus => {
  const trustyAIAreaAvailable = useIsAreaAvailable(SupportedArea.TRUSTY_AI).status;
  const callback = React.useCallback<FetchStateCallbackPromise<State>>(
    (opts) => {
      if (!trustyAIAreaAvailable) {
        return Promise.reject(new NotReadyError('Bias metrics is not enabled'));
      }

      return getTrustyAICR(namespace, opts)
        .then((r) => r)
        .catch((e) => {
          if (e.statusObject?.code === 404) {
            // Not finding is okay, not an error
            return null;
          }
          throw e;
        });
    },
    [namespace, trustyAIAreaAvailable],
  );

  const [isStarting, setIsStarting] = React.useState(false);

  const state = useFetchState<State>(callback, null, {
    initialPromisePurity: true,
    refreshRate: isStarting ? FAST_POLL_INTERVAL : undefined,
  });

  const resourceLoaded = state[1] && !!state[0];
  const hasStatus = taiLoaded(state);
  React.useEffect(() => {
    setIsStarting(!resourceLoaded && !hasStatus);
  }, [hasStatus, resourceLoaded]);

  return { state };
};

export default useTrustyAINamespaceCR;
