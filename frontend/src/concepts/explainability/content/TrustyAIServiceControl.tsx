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
  const {
    isAvailable,
    isProgressing,
    installCR,
    deleteCR,
    refresh,
    error: trustyInstallError,
  } = useManageTrustyAICR(namespace);

  const [notifyAction, setNotifyAction] = React.useState<TrustyAICRActions | undefined>(undefined);
  const [success, setSuccess] = React.useState(false);
  const [crCreationError, setCrCreationError] = React.useState<Error | undefined>(undefined);
  const [userHasChecked, setUserHasChecked] = React.useState(false);

  const error = crCreationError || trustyInstallError;

  const clearNotification = React.useCallback(() => {
    setNotifyAction(undefined);
    setSuccess(false);
    setCrCreationError(undefined);
  }, []);

  React.useEffect(() => {
    if (isAvailable || error) {
      setUserHasChecked(false);
    }
  }, [error, isAvailable]);

  return (
    <Stack hasGutter>
      <StackItem>
        <InstallTrustyAICheckbox
          isAvailable={isAvailable}
          isProgressing={userHasChecked || isProgressing}
          onInstall={() => {
            setUserHasChecked(true);
            installCR()
              .then(() => {
                setNotifyAction(TrustyAICRActions.CREATE);
                setSuccess(true);
              })
              .catch((e) => {
                setNotifyAction(TrustyAICRActions.CREATE);
                setCrCreationError(e);
              });
          }}
          onDelete={deleteCR}
          onPostDelete={() => {
            refresh().then(() => {
              setNotifyAction(TrustyAICRActions.DELETE);
              setSuccess(true);
            });
          }}
          onBeforeChange={clearNotification}
        />
      </StackItem>
      <StackItem>
        <TrustyAIServiceNotification
          loading={userHasChecked || isProgressing}
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
