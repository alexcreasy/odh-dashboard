import React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
  NotReadyError,
} from '~/utilities/useFetchState';
import { getTrustyAIAPIRoute } from '~/api/';
import { RouteKind } from '~/k8sTypes';
import { FAST_POLL_INTERVAL } from '~/utilities/const';

type State = string | null;
const useTrustyAPIRoute = (hasCR: boolean, namespace: string): FetchState<State> => {
  const callback = React.useCallback<FetchStateCallbackPromise<State>>(
    (opts) => {
      if (!hasCR) {
        return Promise.reject(new NotReadyError('CR not created'));
      }

      //TODO: API URI must use HTTPS before release.
      return getTrustyAIAPIRoute(namespace, opts)
        .then((result: RouteKind) => `${result.spec.port.targetPort}://${result.spec.host}`)
        .catch((e) => {
          if (e.statusObject?.code === 404) {
            // Not finding is okay, not an error
            return null;
          }
          throw e;
        });
    },
    [hasCR, namespace],
  );

  // TODO: add duplicate functionality to useFetchState.
  const state = useFetchState<State>(callback, null, {
    initialPromisePurity: true,
  });

  const [data, , , refresh] = state;

  const hasData = !!data;
  React.useEffect(() => {
    let interval;
    if (!hasData) {
      interval = setInterval(refresh, FAST_POLL_INTERVAL);
    }
    return () => {
      clearInterval(interval);
    };
  }, [hasData, refresh]);
  return state;
};

export default useTrustyAPIRoute;
