import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Stack,
  StackItem,
} from '@patternfly/react-core/dist/esm';
import React from 'react';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';
import { KserveMetricsGraphTypes } from '~/concepts/metrics/kserve/const';
import KserveRequestCountGraph from '~/concepts/metrics/kserve/content/KserveRequestCountGraph';
import { TimeframeTitle } from '~/concepts/metrics/types';
import KserveMeanLatencyGraph from '~/concepts/metrics/kserve/content/KserveMeanLatencyGraph';
import KserveCpuUsageGraph from '~/concepts/metrics/kserve/content/KserveCpuUsageGraph';

type KservePerformanceGraphsProps = {
  namespace: string;
  modelName: string;
  graphDefinitions: KserveMetricGraphDefinition[];
};

const KservePerformanceGraphs: React.FC<KservePerformanceGraphsProps> = ({
  namespace,
  modelName,
  graphDefinitions,
}) => {
  const requestCountDef = graphDefinitions.find(
    (x) => x.type === KserveMetricsGraphTypes.REQUEST_COUNT,
  );

  const meanLatencyDef = graphDefinitions.find(
    (x) => x.type === KserveMetricsGraphTypes.MEAN_LATENCY,
  );

  const cpuUsageDef = graphDefinitions.find((x) => x.type === KserveMetricsGraphTypes.CPU_USAGE);

  //TODO: handle user changing of these values
  const timeframe = TimeframeTitle.ONE_HOUR;
  const end = React.useRef(Date.now());

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Namespace</DescriptionListTerm>
                  <DescriptionListDescription>{namespace}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Model Name</DescriptionListTerm>
                  <DescriptionListDescription>{modelName}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
        {requestCountDef && (
          <StackItem>
            <KserveRequestCountGraph
              graphDefinition={requestCountDef}
              timeframe={timeframe}
              end={end.current}
              namespace={namespace}
            />
          </StackItem>
        )}
        {meanLatencyDef && (
          <StackItem>
            <KserveMeanLatencyGraph
              graphDefinition={meanLatencyDef}
              timeframe={timeframe}
              end={end.current}
              namespace={namespace}
            />
          </StackItem>
        )}
        {cpuUsageDef && (
          <StackItem>
            <KserveCpuUsageGraph
              graphDefinition={cpuUsageDef}
              timeframe={timeframe}
              end={end.current}
              namespace={namespace}
            />
          </StackItem>
        )}
        {graphDefinitions.map((def) => (
          <StackItem key={`${def.type}${def.title}`}>
            <Card>
              <CardTitle>{def.title}</CardTitle>
              <CardBody>
                <p>Type: {def.type}</p>
                <p>Queries:</p>
                {def.queries.map((query) => (
                  <p key={query.title}>
                    {query.title}: {query.query}
                  </p>
                ))}
              </CardBody>
            </Card>
          </StackItem>
        ))}
      </Stack>
    </>
  );
};

export default KservePerformanceGraphs;
