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
