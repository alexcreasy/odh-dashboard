import { Bullseye, Spinner, Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import useManageTrustyAICR from '~/concepts/explainability/useManageTrustyAICR';
import TrustyAIServiceNotification from '~/concepts/explainability/content/TrustyAIServiceNotification';
import InstallTrustyAICheckbox from './InstallTrustyAICheckbox';

type TrustyAIServiceControlProps = {
  namespace: string;
};
const TrustyAIServiceControl: React.FC<TrustyAIServiceControlProps> = ({ namespace }) => {
  const {
    isAvailable,
    isProgressing,
    showSuccess,
    installCR,
    deleteCR,
    error,
    crState: [, loaded],
  } = useManageTrustyAICR(namespace);

  const [userHasChecked, setUserHasChecked] = React.useState(false);

  React.useEffect(() => {
    if (isAvailable || error) {
      setUserHasChecked(false);
    }
  }, [error, isAvailable]);

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <Stack hasGutter>
      <StackItem>
        <InstallTrustyAICheckbox
          isAvailable={isAvailable}
          isProgressing={userHasChecked || isProgressing}
          onInstall={() => {
            setUserHasChecked(true);
            installCR();
          }}
          onDelete={deleteCR}
        />
      </StackItem>
      <StackItem>
        <TrustyAIServiceNotification
          loading={userHasChecked || isProgressing}
          showSuccess={showSuccess}
          isAvailable={isAvailable}
          error={error}
          clearNotification={() => {}}
        />
      </StackItem>
    </Stack>
  );
};

export default TrustyAIServiceControl;
