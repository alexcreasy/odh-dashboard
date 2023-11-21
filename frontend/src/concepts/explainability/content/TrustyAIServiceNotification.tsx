import { Alert, AlertActionCloseButton, Bullseye, Spinner } from '@patternfly/react-core';
import React from 'react';

type TrustyAIServiceNotificationProps = {
  error?: Error;
  isAvailable: boolean;
  showSuccess: boolean;
  clearNotification: () => void;
  loading: boolean;
};

const TrustyAIServiceNotification: React.FC<TrustyAIServiceNotificationProps> = ({
  error,
  isAvailable,
  showSuccess,
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

  if (showSuccess && isAvailable) {
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

  if (error) {
    return (
      <Alert variant="danger" title="TrustyAI service error" isLiveRegion isInline>
        {error?.message}
      </Alert>
    );
  }

  return null;
};

export default TrustyAIServiceNotification;
