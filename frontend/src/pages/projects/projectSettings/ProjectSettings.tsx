import React from 'react';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';
import ProjectBiasSettings from '~/pages/projects/projectSettings/ProjectBiasSettings';

const ProjectSettings = () => (
  <PageSection isFilled aria-label="project-settings-page-section" variant="light">
    <Stack hasGutter>
      <StackItem>Configure settings for this project.</StackItem>
      <StackItem>
        <ProjectBiasSettings />
      </StackItem>
    </Stack>
  </PageSection>
);

export default ProjectSettings;
