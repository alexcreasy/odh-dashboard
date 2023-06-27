import { Card, CardBody, CardHeader, CardTitle, Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import InstallTrustyAICheckbox from '~/concepts/explainability/content/InstallTrustyAICheckbox';

type ProjectBiasSettingsProps = {
  namespace: string;
};
const ProjectBiasSettings: React.FC<ProjectBiasSettingsProps> = ({ namespace }) => (
  <Card>
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

export default ProjectBiasSettings;
