import { Card, CardBody, CardHeader, CardTitle, Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import InstallTrustyAICheckbox from '~/concepts/explainability/content/InstallTrustyAICheckbox';

type ModelBiasSettingsCardProps = {
  namespace: string;
};
const ModelBiasSettingsCard: React.FC<ModelBiasSettingsCardProps> = ({ namespace }) => (
  <Card isFlat>
    <CardHeader>
      <CardTitle>Model Bias</CardTitle>
    </CardHeader>
    <CardBody>
      <Stack>
        <StackItem>
          <InstallTrustyAICheckbox namespace={namespace} />
        </StackItem>
      </Stack>
    </CardBody>
  </Card>
);

export default ModelBiasSettingsCard;
