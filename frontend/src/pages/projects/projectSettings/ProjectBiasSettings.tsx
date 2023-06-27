import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import TrustyServiceError from '~/concepts/explainability/TrustyServiceError';
import useNotification from '~/utilities/useNotification';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const ProjectBiasSettings = () => {
  const { namespace } = useParams<{ namespace: string }>();
  const notify = useNotification();

  const installTrusty = React.useCallback(
    (namespace: string) => {
      createTrustyAICR(namespace)
        .then((cr) => {
          notify.info('Intalling TrustyAI', 'Installation in progress');
          console.log('installing XAI: CR: %O', cr);
        })
        .catch((e) => {
          notify.error('TrustyAI install failed', e?.message);
        });
    },
    [notify],
  );

  const deleteTrusty = React.useCallback(
    (namespace: string) => {
      deleteTrustyAICR(namespace)
        .then((status) => {
          notify.info('TrustyAI deleted', 'hello');
          console.log('deleting trusty CR: %O', status);
        })
        .catch((e) => {
          notify.error('Trusty AI deletion failed', e?.message);
        });
    },
    [notify],
  );

  if (!namespace) {
    return <Bullseye>No namespace</Bullseye>;
  }

  return (
    <>
      <Card>
        <CardTitle>Explainability</CardTitle>
        <CardBody>
          <Split>
            <SplitItem>TrustyAI Service</SplitItem>
            <SplitItem>
              <Checkbox isChecked={false} onChange={_.noop} id="controlled-check-1" name="check1" />
              <Button onClick={() => installTrusty(namespace)}>Install</Button>
              <Button onClick={() => deleteTrusty(namespace)}>Delete</Button>
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
};

export default ProjectBiasSettings;
