import React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
  NotReadyError,
} from '~/utilities/useFetchState';
import { TrustyAiKind } from '~/k8sTypes';
import { getTrustyAICR } from '~/api';
import { FAST_POLL_INTERVAL } from '~/utilities/const';
import useBiasMetricsEnabled from './useBiasMetricsEnabled';

type State = TrustyAiKind | null;

export const taiLoaded = ([state, loaded]: FetchState<State>): boolean =>
  loaded &&
  !!state &&
  !!state.status?.conditions?.find((c) => c.type === 'APIServerReady' && c.status === 'True');

export const taiHasServerTimedOut = (
  [state, loaded]: FetchState<State>,
  dspaLoaded: boolean,
): boolean => {
  if (!state || !loaded || dspaLoaded) {
    return false;
  }

  const createTime = state.metadata.creationTimestamp;
  if (!createTime) {
    return false;
  }

  // If we are here, and 5 mins have past, we are having issues
  return Date.now() - new Date(createTime).getTime() > 60 * 5 * 1000;
};

export const hasServerTimedOut = (
  [state, loaded]: FetchState<State>,
  dspaLoaded: boolean,
): boolean => {
  if (!state || !loaded || dspaLoaded) {
    return false;
  }

  const createTime = state.metadata.creationTimestamp;
  if (!createTime) {
    return false;
  }

  // If we are here, and 5 mins have past, we are having issues
  return Date.now() - new Date(createTime).getTime() > 60 * 5 * 1000;
};

const useTrustyAiNamespaceCR = (namespace: string): FetchState<State> => {
  const [biasMetricsEnabled] = useBiasMetricsEnabled();
  // TODO: the logic needs to be fleshed out once the TrustyAI operator is complete.
  const callback = React.useCallback<FetchStateCallbackPromise<State>>(
    (opts) => {
      if (!biasMetricsEnabled) {
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
    [namespace, biasMetricsEnabled],
  );

  const [isStarting, setIsStarting] = React.useState(false);

  const state = useFetchState<State>(callback, null, {
    initialPromisePurity: true,
    refreshRate: isStarting ? FAST_POLL_INTERVAL : undefined,
  });

  const resourceLoaded = state[1] && !!state[0];
  const hasStatus = taiLoaded(state);
  React.useEffect(() => {
    setIsStarting(resourceLoaded && !hasStatus);
  }, [hasStatus, resourceLoaded]);

  return state;
};

export default useTrustyAiNamespaceCR;
