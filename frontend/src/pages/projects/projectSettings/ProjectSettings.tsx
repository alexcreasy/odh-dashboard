import React from 'react';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';

const ProjectSettings = () => (
  <PageSection isFilled aria-label="project-settings-page-section" variant="light">
    <Stack hasGutter>
      <StackItem>Project Settings</StackItem>
    </Stack>
  </PageSection>
);

export default ProjectSettings;
