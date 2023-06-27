import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import useManageTrustyAICR from '~/concepts/explainability/useManageTrustyAICR';
import useNotification from '~/utilities/useNotification';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import TrustyAIDeleteModal from '~/concepts/explainability/content/TrustyAIDeleteModal';

type InstallTrustyAICheckboxProps = {
  namespace: string;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({ namespace }) => {
  const notify = useNotification();
  const { hasCR, installCR, refresh } = useManageTrustyAICR(namespace);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Checkbox
        label="Enable TrustyAI"
        body={
          <HelperText>
            <HelperTextItem>{TRUSTYAI_TOOLTIP_TEXT}</HelperTextItem>
          </HelperText>
        }
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
            // deleteCR()
            //   .then(() => notify.info('Deleting', 'The TrustyAI service is being deleted'))
            //   .catch((e) => {
            //     notify.error('TrustyAI deletion failed', e?.message);
            //   })
            //   .finally(refresh);
            setOpen(true);
          }
        }}
        id="bias-service-installation"
        name="bias-service"
      />
      <TrustyAIDeleteModal
        namespace={namespace}
        isOpen={open}
        onClose={() => {
          setOpen(false);
          refresh();
        }}
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
