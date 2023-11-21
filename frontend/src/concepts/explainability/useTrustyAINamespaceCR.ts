import React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
  NotReadyError,
} from '~/utilities/useFetchState';
import { TrustyAIKind } from '~/k8sTypes';
import { getTrustyAICR } from '~/api';
import { FAST_POLL_INTERVAL, SERVER_TIMEOUT } from '~/utilities/const';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

type State = TrustyAIKind | null;

export type TrustyAINamespaceStatus = {
  isProgressing: boolean;
  isAvailable: boolean;
  crState: FetchState<State>;
};

export const isTrustyCRStatusAvailable = (cr: TrustyAIKind): boolean =>
  !!cr.status?.conditions?.find((c) => c.type === 'Available' && c.status === 'True');

export const isTrustyAIAvailable = ([state, loaded]: FetchState<State>): boolean =>
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
  return Date.now() - new Date(createTime).getTime() > SERVER_TIMEOUT;
};

const useTrustyAINamespaceCR = (namespace: string): TrustyAINamespaceStatus => {
  const trustyAIAreaAvailable = useIsAreaAvailable(SupportedArea.TRUSTY_AI).status;

  const callback = React.useCallback<FetchStateCallbackPromise<State>>(
    (opts) => {
      if (!trustyAIAreaAvailable) {
        return Promise.reject(new NotReadyError('Bias metrics is not enabled'));
      }

      return getTrustyAICR(namespace, opts).catch((e) => {
        if (e.statusObject?.code === 404) {
          // Not finding is okay, not an error
          return null;
        }
        throw e;
      });
    },
    [namespace, trustyAIAreaAvailable],
  );

  const [doRefresh, setDoRefresh] = React.useState(true);

  const state = useFetchState<State>(callback, null, {
    initialPromisePurity: true,
    refreshRate: doRefresh ? FAST_POLL_INTERVAL : undefined,
  });

  const isAvailable = isTrustyAIAvailable(state);
  const isStarting = state[1] && !!state[0] && !isAvailable;
  React.useEffect(() => {
    setDoRefresh(!isAvailable);
  }, [isAvailable]);

  return { isProgressing: isStarting, isAvailable: isAvailable, crState: state };
};

export default useTrustyAINamespaceCR;
