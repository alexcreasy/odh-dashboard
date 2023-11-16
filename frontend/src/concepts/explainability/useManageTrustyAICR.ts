import React from 'react';
import useTrustyAINamespaceCR from '~/concepts/explainability/useTrustyAINamespaceCR';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const useManageTrustyAICR = (namespace: string) => {
  const {
    isProgressing,
    isAvailable,
    crState: [trustyCR, , error, refresh],
  } = useTrustyAINamespaceCR(namespace);

  const installCR = React.useCallback(() => createTrustyAICR(namespace), [namespace]);

  const deleteCR = React.useCallback(() => deleteTrustyAICR(namespace), [namespace]);

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
