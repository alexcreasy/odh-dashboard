import { Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import useManageTrustyAICR from '~/concepts/explainability/useManageTrustyAICR';
import TrustyAIServiceNotification from '~/concepts/explainability/content/TrustyAIServiceNotification';
import { TrustyAICRActions } from './const';
import InstallTrustyAICheckbox from './InstallTrustyAICheckbox';

type TrustyAIServiceControlProps = {
  namespace: string;
};
const TrustyAIServiceControl: React.FC<TrustyAIServiceControlProps> = ({ namespace }) => {
  const { isAvailable, isProgressing, installCR, deleteCR, refresh } =
    useManageTrustyAICR(namespace);

  const [notifyAction, setNotifyAction] = React.useState<TrustyAICRActions | undefined>(undefined);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  return (
    <Stack hasGutter>
      <StackItem>
        <InstallTrustyAICheckbox
          isAvailable={isAvailable}
          isProgressing={isProgressing}
          onInstall={() => {
            installCR()
              .then(() => {
                setNotifyAction(TrustyAICRActions.CREATE);
                setSuccess(true);
                setError(undefined);
              })
              .catch((e) => {
                setNotifyAction(TrustyAICRActions.CREATE);
                setSuccess(false);
                setError(e);
              });
          }}
          onDelete={deleteCR}
          onPostDelete={() => {
            refresh().then(() => {
              setNotifyAction(TrustyAICRActions.DELETE);
              setSuccess(true);
              setError(undefined);
            });
          }}
        />
      </StackItem>
      <StackItem>
        <TrustyAIServiceNotification
          loading={isProgressing}
          notifyAction={notifyAction}
          success={success}
          isAvailable={isAvailable}
          error={error}
          clearNotification={() => {
            setNotifyAction(undefined);
            setSuccess(false);
            setError(undefined);
          }}
        />
      </StackItem>
    </Stack>
  );
};

export default TrustyAIServiceControl;
