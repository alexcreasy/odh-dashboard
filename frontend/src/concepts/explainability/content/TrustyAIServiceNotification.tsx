import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import React from 'react';
import { TrustyAICRActions } from '~/concepts/explainability/content/const';

type TrustyAIServiceNotificationProps = {
  notifyAction?: TrustyAICRActions;
  success: boolean;
  error?: Error;
  isAvailable: boolean;
  clearNotification: () => void;
};

const TrustyAIServiceNotification: React.FC<TrustyAIServiceNotificationProps> = ({
  notifyAction,
  success,
  error,
  isAvailable,
  clearNotification,
}) => {
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
        {/* This is a temporary fix, this should be updated to incorporate work from
          https://github.com/opendatahub-io/odh-dashboard/pull/2032 in the future to provide a
          better experience.*/}
        {error?.message.includes('404')
          ? 'The TrustyAI operator is not installed on this cluster.'
          : error?.message}
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
