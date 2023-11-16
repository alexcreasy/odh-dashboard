import React from 'react';
import { Checkbox, HelperText, HelperTextItem } from '@patternfly/react-core';
import { TRUSTYAI_TOOLTIP_TEXT } from '~/pages/projects/projectSettings/const';
import TrustyAIDeleteModal from '~/concepts/explainability/content/TrustyAIDeleteModal';
import { TrustyAIKind } from '~/k8sTypes';

export enum TrustyAICRActions {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

type InstallTrustyAICheckboxProps = {
  namespace: string;
  isAvailable: boolean;
  isProgressing: boolean;
  installCR: () => Promise<TrustyAIKind>;
  onAction: (action: TrustyAICRActions, success: boolean, error?: Error) => void;
};
const InstallTrustyAICheckbox: React.FC<InstallTrustyAICheckboxProps> = ({
  namespace,
  isAvailable,
  isProgressing,
  installCR,
  onAction,
}) => {
  const [open, setOpen] = React.useState(false);

  const onCloseDeleteModal = React.useCallback(
    (deleted: boolean) => {
      setOpen(false);
      //refresh();
      if (deleted) {
        onAction(TrustyAICRActions.DELETE, true);
      }
    },
    [onAction],
  );

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
            installCR()
              .then(() => onAction(TrustyAICRActions.CREATE, true))
              .catch((e) => {
                onAction(TrustyAICRActions.CREATE, false, e);
              });
          } else {
            setOpen(true);
          }
        }}
        id="bias-service-installation"
        name="bias-service"
      />
      <TrustyAIDeleteModal namespace={namespace} isOpen={open} onClose={onCloseDeleteModal} />
    </>
  );
};

export default InstallTrustyAICheckbox;
