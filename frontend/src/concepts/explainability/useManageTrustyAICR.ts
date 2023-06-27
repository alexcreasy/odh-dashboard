import React from 'react';
import useTrustyAINamespaceCR from '~/concepts/explainability/useTrustyAINamespaceCR';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const useManageTrustyAICR = (namespace: string) => {
  const [trustyCR, , error, refresh] = useTrustyAINamespaceCR(namespace);

  const hasCR = !!trustyCR;

  const installCR = React.useCallback(() => {
    if (hasCR) {
      return Promise.reject(
        new Error(`A TrustyAI service instance already exists in namespace: ${namespace}`),
      );
    }

    return createTrustyAICR(namespace);
  }, [hasCR, namespace]);

  const deleteCR = React.useCallback(() => {
    if (!hasCR) {
      return Promise.reject(
        new Error(`Could not find a TrustyAI service instance in namespace: ${namespace}`),
      );
    }

    return deleteTrustyAICR(namespace);
  }, [hasCR, namespace]);

  return {
    hasCR,
    error,
    refresh,
    installCR,
    deleteCR,
  };
};

export default useManageTrustyAICR;
