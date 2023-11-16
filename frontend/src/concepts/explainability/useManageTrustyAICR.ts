import React from 'react';
import useTrustyAINamespaceCR from '~/concepts/explainability/useTrustyAINamespaceCR';
import { createTrustyAICR, deleteTrustyAICR } from '~/api';

const useManageTrustyAICR = (namespace: string) => {
  const {
    isProgressing,
    isAvailable,
    crState: [trustyCR, , error, refresh],
  } = useTrustyAINamespaceCR(namespace);

  const installCR = React.useCallback(() => createTrustyAICR(namespace), [namespace]); //useInstallTrustyAICR(namespace); //React.useCallback(() => createTrustyAICR(namespace), [namespace]);

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

// const useInstallTrustyAI = (namespace: string, callback?: () => void) => {};

// const useInstallTrustyAICR = (namespace: string) => {
//   const promiseRef = React.useRef<Promise<void>>();
//   const resolveRef = React.useRef<(value: void | PromiseLike<void>) => void>();
//   const rejectRef = React.useRef<(reason?: unknown) => void>();
//
//   const reset = () => {
//     promiseRef.current = undefined;
//     resolveRef.current = undefined;
//     rejectRef.current = undefined;
//   };
//
//   // const doResolve = () => {
//   //   if (resolveRef.current) {
//   //     resolveRef.current();
//   //     reset();
//   //   }
//   // };
//   //
//   // const doReject = (reason?: unknown) => {
//   //   if (rejectRef.current) {
//   //     rejectRef.current(reason);
//   //     reset();
//   //   }
//   // };
//
//   const {
//     isAvailable,
//     crState: [, , error],
//   } = useTrustyAINamespaceCR(namespace);
//
//   React.useEffect(() => {
//     if (promiseRef.current) {
//       if (isAvailable) {
//         if (resolveRef.current) {
//           resolveRef.current();
//           reset();
//         }
//       }
//       if (error) {
//         if (rejectRef.current) {
//           rejectRef.current(error);
//           reset();
//         }
//       }
//     }
//   }, [error, isAvailable]);
//
//   return React.useCallback(() => {
//     promiseRef.current = new Promise((resolve, reject) => {
//       resolveRef.current = resolve;
//       rejectRef.current = reject;
//
//       createTrustyAICR(namespace).catch((e) => {
//         reject(e);
//         reset();
//       });
//     });
//
//     return promiseRef.current;
//   }, [namespace]);
// };

export default useManageTrustyAICR;
