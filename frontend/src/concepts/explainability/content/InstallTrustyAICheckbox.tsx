import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import { noop } from 'lodash-es';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import DeleteTrustyAIModal from '~/concepts/explainability/content/DeleteTrustyAIModal';
import { K8sStatus } from '~/k8sTypes';

type InstallTrustyAICheckboxProps = {
  isAvailable: boolean;
  isProgressing: boolean;
  onInstall: () => void;
  onPostInstall?: () => void;
  onDelete: () => Promise<K8sStatus>;
  onPostDelete?: () => void;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({
  isAvailable,
  isProgressing,
  onInstall,
  onPostInstall = noop,
  onDelete,
  onPostDelete = noop,
}) => {
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
        isChecked={isAvailable}
        isDisabled={isProgressing}
        onChange={(checked) => {
          if (checked) {
            onInstall();
            // onInstall()
            //   .then(() => onAction(TrustyAICRActions.CREATE, true))
            //   .catch((e) => {
            //     onAction(TrustyAICRActions.CREATE, false, e);
            //   });
            onPostInstall();
          } else {
            setOpen(true);
          }
        }}
        id="bias-service-installation"
        name="bias-service"
      />
      <DeleteTrustyAIModal
        isOpen={open}
        onDelete={onDelete}
        onClose={() => {
          setOpen(false);
          onPostDelete();
        }}
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
