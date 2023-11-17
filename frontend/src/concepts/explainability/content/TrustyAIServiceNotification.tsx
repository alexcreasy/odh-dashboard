import { Alert, AlertActionCloseButton, Bullseye, Spinner } from '@patternfly/react-core';
import React from 'react';
import { TrustyAICRActions } from '~/concepts/explainability/content/const';

type TrustyAIServiceNotificationProps = {
  notifyAction?: TrustyAICRActions;
  success: boolean;
  error?: Error;
  isAvailable: boolean;
  clearNotification: () => void;
  loading: boolean;
};

const TrustyAIServiceNotification: React.FC<TrustyAIServiceNotificationProps> = ({
  notifyAction,
  success,
  error,
  isAvailable,
  clearNotification,
  loading,
}) => {
  if (loading) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (success && notifyAction === TrustyAICRActions.CREATE && isAvailable) {
    return (
      <Alert
        variant="success"
        title="TrustyAI installed"
        actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        isLiveRegion
        isInline
      >
        The TrustyAI service was successfully installed
      </Alert>
    );
  }

  if (!success && notifyAction === TrustyAICRActions.CREATE) {
    return (
      <Alert
        variant="danger"
        title="TrustyAI installation error"
        actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        isLiveRegion
        isInline
      >
        {error?.message}
      </Alert>
    );
  }

  if (success && notifyAction === TrustyAICRActions.DELETE) {
    return (
      <Alert
        variant="success"
        title="TrustyAI uninstalled"
        actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        isLiveRegion
        isInline
      >
        The TrustyAI service was successfully uninstalled
      </Alert>
    );
  }

  if (!success && notifyAction === TrustyAICRActions.DELETE) {
    return (
      <Alert
        variant="danger"
        title="TrustyAI uninstallation error"
        actionClose={<AlertActionCloseButton onClose={clearNotification} />}
        isLiveRegion
        isInline
      >
        {error?.message}
      </Alert>
    );
  }

  return null;
};

export default TrustyAIServiceNotification;
