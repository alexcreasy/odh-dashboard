import { Card, CardBody, CardTitle, Checkbox, Split, SplitItem } from '@patternfly/react-core';
import React from 'react';
import _ from 'lodash';
import TrustyServiceError from '~/concepts/explainability/TrustyServiceError';

const ProjectBiasSettings = () => (
  <>
    <Card>
      <CardTitle>Explainability</CardTitle>
      <CardBody>
        <Split>
          <SplitItem>TrustyAI Service</SplitItem>
          <SplitItem>
            <Checkbox isChecked={false} onChange={_.noop} id="controlled-check-1" name="check1" />
          </SplitItem>
        </Split>
      </CardBody>
    </Card>
    <Card>
      <CardBody>
        <TrustyServiceError />
      </CardBody>
    </Card>
  </>
);

export default ProjectBiasSettings;
