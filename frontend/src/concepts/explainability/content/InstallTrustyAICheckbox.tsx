import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import DeleteTrustyAIModal from '~/concepts/explainability/content/DeleteTrustyAIModal';

type InstallTrustyAICheckboxProps = {
  isAvailable: boolean;
  isProgressing: boolean;
  onInstall: () => void;
  onDelete: () => Promise<unknown>;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({
  isAvailable,
  isProgressing,
  onInstall,
  onDelete,
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
          } else {
            setOpen(true);
          }
        }}
        id="trustyai-service-installation"
        name="TrustyAI service installation status"
      />
      <DeleteTrustyAIModal
        isOpen={open}
        onDelete={onDelete}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
