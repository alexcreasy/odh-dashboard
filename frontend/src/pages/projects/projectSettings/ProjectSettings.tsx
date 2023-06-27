import React from 'react';
import { PageSection, Stack, StackItem } from '@patternfly/react-core';
import ProjectBiasSettings from '~/pages/projects/projectSettings/ProjectBiasSettings';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';

const ProjectSettings = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const namespace = currentProject.metadata.name;

  return (
    <PageSection isFilled aria-label="project-settings-page-section" variant="light">
      <Stack hasGutter>
        <StackItem>
          <ProjectBiasSettings namespace={namespace} />
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export default ProjectSettings;
