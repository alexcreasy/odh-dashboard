import {
  Alert,
  AlertActionCloseButton,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import React from 'react';
import InstallTrustyAICheckbox, {
  TrustyAICRActions,
} from '~/concepts/explainability/content/InstallTrustyAICheckbox';

type ModelBiasSettingsCardProps = {
  namespace: string;
};
const ModelBiasSettingsCard: React.FC<ModelBiasSettingsCardProps> = ({ namespace }) => {
  const [notifyAction, setNotifyAction] = React.useState<TrustyAICRActions | undefined>(undefined);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const clearNotification = React.useCallback(() => {
    setNotifyAction(undefined);
    setSuccess(false);
    setError(undefined);
  }, []);

  const renderNotification = () => {
    if (success && notifyAction === TrustyAICRActions.CREATE) {
      return (
        <Alert
          variant="success"
          isInline
          title="TrustyAI installed"
          actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        >
          The TrustAI service was successfully installed
        </Alert>
      );
    }

    if (!success && notifyAction === TrustyAICRActions.CREATE) {
      return (
        <Alert
          variant="danger"
          isInline
          title="TrustyAI installation error"
          actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        >
          {error?.message}
        </Alert>
      );
    }

    if (success && notifyAction === TrustyAICRActions.DELETE) {
      return (
        <Alert
          variant="success"
          isInline
          title="TrustyAI uninstalled"
          actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        >
          The TrustAI service was successfully uninstalled
        </Alert>
      );
    }

    if (!success && notifyAction === TrustyAICRActions.DELETE) {
      return (
        <Alert
          variant="danger"
          isInline
          title="TrustyAI uninstallation error"
          actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        >
          {error?.message}
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card isFlat>
      <CardHeader>
        <CardTitle>Model Bias</CardTitle>
      </CardHeader>
      <CardBody>
        <Stack>
          <StackItem>
            <InstallTrustyAICheckbox
              namespace={namespace}
              onAction={(action, success, error) => {
                setNotifyAction(action);
                setSuccess(success);
                setError(error);
              }}
            />
          </StackItem>
        </Stack>
      </CardBody>
      <CardFooter>{renderNotification()}</CardFooter>
    </Card>
  );
};

export default ModelBiasSettingsCard;
