import React from 'react';
import useTrustyAINamespaceCR, {
  isTrustyAIAvailable,
} from '~/concepts/explainability/useTrustyAINamespaceCR';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const useManageTrustyAICR = (namespace: string) => {
  const state = useTrustyAINamespaceCR(namespace);
  const [cr, loaded, error, refresh] = state;

  const isAvailable = isTrustyAIAvailable(state);
  const isProgressing = loaded && !!cr && !isAvailable;

  const installCR = React.useCallback(
    () => createTrustyAICR(namespace).then(refresh),
    [namespace, refresh],
  );

  const deleteCR = React.useCallback(
    () => deleteTrustyAICR(namespace).then(refresh),
    [namespace, refresh],
  );

  return {
    hasCR: !!cr,
    isProgressing,
    isAvailable,
    error,
    refresh,
    installCR,
    deleteCR,
    crState: state,
  };
};

export default useManageTrustyAICR;
