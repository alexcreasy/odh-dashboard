import { Card, CardTitle, Stack, StackItem, CardBody } from '@patternfly/react-core/dist/esm';
import React from 'react';
import { KserveMetricGraphDefinition } from '~/concepts/metrics/kserve/types';

type KservePerformanceGraphsProps = {
  namespace: string;
  modelName: string;
  graphDefinitions: KserveMetricGraphDefinition[];
};

const kservePerformanceGraphs: React.FC<KservePerformanceGraphsProps> = ({
  namespace,
  modelName,
  graphDefinitions,
}) => (
  <Stack>
    <StackItem>
      <p>namespace: {namespace}</p>
      <p>modelName: {modelName}</p>
    </StackItem>
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
);

export default kservePerformanceGraphs;
