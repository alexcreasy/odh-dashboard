import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import useManageTrustyAICR from '~/concepts/explainability/useManageTrustyAICR';
import useNotification from '~/utilities/useNotification';

type InstallTrustyAICheckboxProps = {
  namespace: string;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({ namespace }) => {
  const notify = useNotification();
  const { hasCR, installCR, deleteCR, refresh } = useManageTrustyAICR(namespace);

  return (
    <>
      <Checkbox
        label="Bias Service"
        isChecked={hasCR}
        onChange={(checked) => {
          if (checked) {
            installCR()
              .then(() => notify.info('Installing', 'The TrustyAI service is being installed'))
              .catch((e) => {
                notify.error('TrustyAI installation failed', e?.message);
              })
              .finally(refresh);
          } else {
            deleteCR()
              .then(() => notify.info('Deleting', 'The TrustyAI service is being deleted'))
              .catch((e) => {
                notify.error('TrustyAI deletion failed', e?.message);
              })
              .finally(refresh);
          }
        }}
        id="bias-service-installation"
        name="bias-service"
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
