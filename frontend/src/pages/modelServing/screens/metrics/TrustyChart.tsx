import React from 'react';
import { ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import _ from 'lodash';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';
import ScheduledMetricSelect from '~/pages/modelServing/screens/metrics/ScheduledMetricSelect';
import {
  InferenceMetricType,
  ModelServingMetricsContext,
} from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import {
  DomainCalculator,
  MetricsChartTypes,
  TrustyMetaData,
} from '~/pages/modelServing/screens/metrics/types';

type TrustyChartProps = {
  title: string;
  abbreviation: string;
  metricType: InferenceMetricType.TRUSTY_AI_SPD | InferenceMetricType.TRUSTY_AI_DIR;
  tooltip: React.ReactNode;
  thresholds: [number, number];
  domain: DomainCalculator;
  type?: MetricsChartTypes;
};

const TrustyChart: React.FC<TrustyChartProps> = ({
  title,
  abbreviation,
  metricType,
  tooltip,
  thresholds,
  domain,
  type = MetricsChartTypes.AREA,
}) => {
  const THRESHOLD_COLOR = 'red';
  const { data } = React.useContext(ModelServingMetricsContext);
  const metric = {
    ...data[metricType],
    data: data[metricType].data[0]?.values,
  };
  const fullPayload = data[metricType].data;

  // TODO: Subject to change in next iteration. This is just a placeholder for the demo that needs redesigning.
  const metadata: TrustyMetaData[] = fullPayload.map((payload) => ({
    protectedAttribute: payload.metric.protected,
    protectedValue: payload.metric.privileged,
    favorableOutput: payload.metric.outcome,
    favorableValue: payload.metric.favorable_value,
  }));

  const metadataSet: TrustyMetaData[] = _.uniqWith(metadata, _.isEqual);

  return (
    <MetricsChart
      title={`${title} (${abbreviation})`}
      metrics={{
        name: abbreviation,
        metric: metric,
      }}
      domain={domain}
      toolbar={
        <ToolbarContent>
          <ToolbarItem>{tooltip}</ToolbarItem>
          <ToolbarItem variant="label">Scheduled Metric</ToolbarItem>
          <ToolbarItem>
            <ScheduledMetricSelect metadata={metadataSet} />
          </ToolbarItem>
        </ToolbarContent>
      }
      thresholds={thresholds.map((t) => ({
        value: t,
        color: THRESHOLD_COLOR,
      }))}
      type={type}
    />
  );
};
export default TrustyChart;
