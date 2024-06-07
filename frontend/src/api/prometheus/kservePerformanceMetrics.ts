import React from 'react';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';
import { defaultResponsePredicate } from '~/api/prometheus/usePrometheusQueryRange';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import { TimeframeTitle } from '~/concepts/metrics/types';
import useRestructureContextResourceData from '~/utilities/useRestructureContextResourceData';
import useQueryRangeResourceData from '~/api/prometheus/useQueryRangeResourceData';
import { PrometheusQueryRangeResultValue } from '~/types';

type RequestCountData = {
  data: {
    successCount: ReturnType<
      typeof useRestructureContextResourceData<PrometheusQueryRangeResultValue>
    >;
    failedCount: ReturnType<
      typeof useRestructureContextResourceData<PrometheusQueryRangeResultValue>
    >;
  };
  refreshAll: () => void;
};

export const useFetchKserveRequestCountData = (
  metricsDef: KserveMetricGraphDefinition,
  timeframe: TimeframeTitle,
  endInMs: number,
  namespace: string,
): RequestCountData => {
  const active = useIsAreaAvailable(SupportedArea.K_SERVE_METRICS).status;

  //TODO: Necessary due to bug on backend - must be removed before release.
  const successQuery = metricsDef.queries[0].query.replace('[${rate_interval}]', '[5m]');
  const failedQuery = metricsDef.queries[1].query.replace('[${rate_interval}]', '[5m]');

  const successCount = useQueryRangeResourceData(
    active,
    successQuery,
    endInMs,
    timeframe,
    defaultResponsePredicate,
    namespace,
  );

  const failedCount = useQueryRangeResourceData(
    active,
    failedQuery,
    endInMs,
    timeframe,
    defaultResponsePredicate,
    namespace,
  );

  const data = React.useMemo(
    () => ({
      successCount,
      failedCount,
    }),
    [failedCount, successCount],
  );

  return useAllSettledContextResourceData(data);
};

type MeanLatencyData = {
  data: {
    inferenceLatency: ReturnType<
      typeof useRestructureContextResourceData<PrometheusQueryRangeResultValue>
    >;
    requestLatency: ReturnType<
      typeof useRestructureContextResourceData<PrometheusQueryRangeResultValue>
    >;
  };
  refreshAll: () => void;
};

// export const useFetchKserveMeanLatencyData = (
//   metricsDef: KserveMetricGraphDefinition,
//   endInMs: number,
//   namespace: string,
// ): MeanLatencyData => {
//   const active = useIsAreaAvailable(SupportedArea.K_SERVE_METRICS).status;
// };

const useAllSettledContextResourceData = <
  T,
  U extends Record<string, ReturnType<typeof useRestructureContextResourceData<T>>>,
>(
  data: U,
) => {
  const refreshAll = React.useCallback(() => {
    Object.values(data).forEach((x) => x.refresh());
  }, [data]);

  const result = React.useMemo(
    () => ({
      data,
      refreshAll,
    }),
    [data, refreshAll],
  );

  // store the result in a reference and only update the reference so long as there are no pending queries
  //TODO: this creates a bug where the first render may contain a mix of pending / non pending data, causing a flash.
  //      need to take a default empty value to return first time.
  const resultRef = React.useRef(result);

  if (!Object.values(result.data).find((x) => x.pending)) {
    resultRef.current = result;
  }

  return resultRef.current;
};
