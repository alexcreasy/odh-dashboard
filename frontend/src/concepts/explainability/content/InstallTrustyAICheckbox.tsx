import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import useManageTrustyAICR from '~/concepts/explainability/useManageTrustyAICR';
import useNotification from '~/utilities/useNotification';

type InstallTrustyAICheckboxProps = {
  namespace: string;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({ namespace }) => {
  const notify = useNotification();
  const { hasCR, installCR } = useManageTrustyAICR(namespace);

  return (
    <>
      <Checkbox
        label="Bias Service"
        isChecked={hasCR}
        onChange={(checked) => {
          if (checked) {
            installCR().then(() =>
              notify.info('Installing', 'The TrustyAI service is being installed'),
            );
          } else {
            console.log('Deleting.... yes');
          }
        }}
        id="bias-service-installation"
        name="bias-service"
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
