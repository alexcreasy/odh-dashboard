import React from 'react';
import useTrustyAINamespaceCR from '~/concepts/explainability/useTrustyAINamespaceCR';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const useManageTrustyAICR = (namespace: string) => {
  const {
    isProgressing,
    isAvailable,
    crState: [trustyCR, , error, refresh],
  } = useTrustyAINamespaceCR(namespace);

  const installCR = React.useCallback(
    () => createTrustyAICR(namespace).then(refresh),
    [namespace, refresh],
  );

  const deleteCR = React.useCallback(
    () => deleteTrustyAICR(namespace).then(refresh),
    [namespace, refresh],
  );

  return {
    hasCR: !!trustyCR,
    isProgressing,
    isAvailable,
    error,
    refresh,
    installCR,
    deleteCR,
  };
};

export default useManageTrustyAICR;
