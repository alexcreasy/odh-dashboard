import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import { noop } from 'lodash-es';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import DeleteTrustyAIModal from '~/concepts/explainability/content/DeleteTrustyAIModal';
import { K8sStatus, TrustyAIKind } from '~/k8sTypes';
import { TrustyAICRActions } from '~/concepts/explainability/content/const';

type InstallTrustyAICheckboxProps = {
  isAvailable: boolean;
  isProgressing: boolean;
  onInstall: () => Promise<TrustyAIKind>;
  onPostInstall?: () => void;
  onAction: (action: TrustyAICRActions, success: boolean, error?: Error) => void;
  onDelete: () => Promise<K8sStatus>;
  onPostDelete?: () => void;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({
  isAvailable,
  isProgressing,
  onInstall,
  onPostInstall = noop,
  onAction,
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
            onInstall()
              .then(() => onAction(TrustyAICRActions.CREATE, true))
              .catch((e) => {
                onAction(TrustyAICRActions.CREATE, false, e);
              });
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
