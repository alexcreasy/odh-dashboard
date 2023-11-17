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
  const clearNotification = React.useCallback(() => {
    setNotifyAction(undefined);
    setSuccess(false);
    setError(undefined);
  }, []);

  return (
    <Stack>
      <StackItem>
        <InstallTrustyAICheckbox
          isAvailable={isAvailable}
          isProgressing={isProgressing}
          onInstall={installCR}
          onAction={(action, success, error) => {
            setNotifyAction(action);
            setSuccess(success);
            setError(error);
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
          notifyAction={notifyAction}
          success={success}
          isAvailable={isAvailable}
          error={error}
          clearNotification={clearNotification}
        />
      </StackItem>
    </Stack>
  );
};

export default TrustyAIServiceControl;
