import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import { noop } from 'lodash-es';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import DeleteTrustyAIModal from '~/concepts/explainability/content/DeleteTrustyAIModal';

type InstallTrustyAICheckboxProps = {
  isAvailable: boolean;
  isProgressing: boolean;
  onInstall: () => void;
  onDelete: () => Promise<unknown>;
  onPostDelete?: () => void;
  onBeforeChange?: () => void;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({
  isAvailable,
  isProgressing,
  onInstall,
  onDelete,
  onPostDelete = noop,
  onBeforeChange = noop,
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
          onBeforeChange();
          if (checked) {
            onInstall();
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
        onClose={(deleted) => {
          setOpen(false);
          if (deleted) {
            onPostDelete();
          }
        }}
      />
    </>
  );
};

export default InstallTrustyAICheckbox;
