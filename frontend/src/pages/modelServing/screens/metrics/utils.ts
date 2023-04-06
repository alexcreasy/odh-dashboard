import * as _ from 'lodash';
import { SelectOptionObject } from '@patternfly/react-core';
import * as React from 'react';
import { TimeframeTitle } from '~/pages/modelServing/screens/types';
import { InferenceServiceKind, ServingRuntimeKind } from '~/k8sTypes';
import { DashboardConfig } from '~/types';
import {
  GraphMetricLine,
  GraphMetricPoint,
  MetricChartLine,
  NamedMetricChartLine,
  TranslatePoint,
} from '~/pages/modelServing/screens/metrics/types';
import { InferenceMetricType, RuntimeMetricType } from './ModelServingMetricsContext';

export const isModelMetricsEnabled = (
  dashboardNamespace: string,
  dashboardConfig: DashboardConfig,
): boolean => {
  if (dashboardNamespace === 'redhat-ods-applications') {
    return true;
  }
  return dashboardConfig.spec.dashboardConfig.modelMetricsNamespace !== '';
};

export const getRuntimeMetricsQueries = (
  runtime: ServingRuntimeKind,
): Record<RuntimeMetricType, string> => {
  const namespace = runtime.metadata.namespace;
  return {
    // TODO: Get new queries
    [RuntimeMetricType.REQUEST_COUNT]: `TBD`,
    [RuntimeMetricType.AVG_RESPONSE_TIME]: `rate(modelmesh_api_request_milliseconds_sum{exported_namespace="${namespace}"}[1m])/rate(modelmesh_api_request_milliseconds_count{exported_namespace="${namespace}"}[1m])`,
    [RuntimeMetricType.CPU_UTILIZATION]: `TBD`,
    [RuntimeMetricType.MEMORY_UTILIZATION]: `TBD`,
  };
};

export const getInferenceServiceMetricsQueries = (
  inferenceService: InferenceServiceKind,
): Record<InferenceMetricType, string> => {
  const namespace = inferenceService.metadata.namespace;
  const name = inferenceService.metadata.name;

  //TODO: Use it or lose it!!
  const prometheusNamespace =
    inferenceService.metadata.annotations?.['opendatahub.io/prometheus-namespace'] ?? namespace;
  return {
    // TODO: Fix queries - create new category for Bias Metrics
    [InferenceMetricType.REQUEST_COUNT_SUCCESS]: `sum(haproxy_backend_http_responses_total{exported_namespace="${namespace}", route="${name}"})`,
    [InferenceMetricType.REQUEST_COUNT_FAILED]: `sum(haproxy_backend_http_responses_total{exported_namespace="${namespace}", route="${name}"})`,
    // TODO: Unhard code the namespace
    [InferenceMetricType.TRUSTY_AI_SPD]: `trustyai_spd{model="${name}", namespace="trustyai-e2e"}`,
    [InferenceMetricType.TRUSTY_AI_DIR]: `trustyai_dir{model="${name}", namespace="trustyai-e2e"}`,
    // TODO: Remove comments below - useful info for now
    // model="demo-loan-rfc-alpha", namespace="trustyai-e2e"
    //`trustyai_spd{batch_size="50000", container="trustyai-service", endpoint="8080", favorable_value="0", instance="10.128.6.47:8080", job="trustyai-service", model="demo-loan-rfc-alpha", namespace="trustyai-e2e", outcome="output-0", pod="trustyai-service-76bd7cfc7-b52dr", privileged="1.0", protected="input-3", request="59859772-dc3e-4707-a7d4-cd3e24315181", service="trustyai-service", unprivileged="0.0"}
    //trustyai_spd[10m]`,
  };
};

export const isTimeframeTitle = (
  timeframe: string | SelectOptionObject,
): timeframe is TimeframeTitle =>
  Object.values(TimeframeTitle).includes(timeframe as TimeframeTitle);

export const convertTimestamp = (timestamp: number, show?: 'date' | 'second'): string => {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const ampm = hour > 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  const minuteString = minute < 10 ? '0' + minute : minute;
  const secondString = second < 10 ? '0' + second : second;
  return `${show === 'date' ? `${day} ${month} ` : ''}${hour}:${minuteString}${
    show === 'second' ? `:${secondString}` : ''
  } ${ampm}`;
};

export const getThresholdData = (data: GraphMetricLine[], threshold: number): GraphMetricLine =>
  _.uniqBy(
    _.uniq(
      data.reduce<number[]>((xValues, line) => [...xValues, ...line.map((point) => point.x)], []),
    ).map((xValue) => ({
      name: 'Threshold',
      x: xValue,
      y: threshold,
    })),
    (value) => value.x,
  );

export const formatToShow = (timeframe: TimeframeTitle): 'date' | 'second' | undefined => {
  switch (timeframe) {
    case TimeframeTitle.ONE_HOUR:
    case TimeframeTitle.ONE_DAY:
      return undefined;
    default:
      return 'date';
  }
};

export const per100: TranslatePoint = (point) => ({
  ...point,
  y: point.y / 100,
});

export const createGraphMetricLine = ({
  metric,
  name,
  translatePoint,
}: NamedMetricChartLine): GraphMetricLine =>
  metric.data?.map<GraphMetricPoint>((data) => {
    const point: GraphMetricPoint = {
      x: data[0] * 1000,
      y: parseFloat(data[1]),
      name,
    };
    if (translatePoint) {
      return translatePoint(point);
    }
    return point;
  }) || [];

export const useStableMetrics = (
  metricChartLine: MetricChartLine,
  chartTitle: string,
): NamedMetricChartLine[] => {
  const metricsRef = React.useRef<NamedMetricChartLine[]>([]);

  const metrics = Array.isArray(metricChartLine)
    ? metricChartLine
    : [{ ...metricChartLine, name: metricChartLine.name ?? chartTitle }];

  if (
    metrics.length !== metricsRef.current.length ||
    metrics.some((graphLine, i) => graphLine.metric !== metricsRef.current[i].metric)
  ) {
    metricsRef.current = metrics;
  }

  return metricsRef.current;
};
