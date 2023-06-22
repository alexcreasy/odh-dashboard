import React from 'react';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';

const TrustyServiceError: React.FC = () => {
  const { serverTimedOut, serviceLoadError, hasCR, apiState } =
    React.useContext(ExplainabilityContext);

  // if (serverTimedOut) {
  //   return (
  //     <Alert
  //       variant="danger"
  //       isInline
  //       title="TrustyAI server failed"
  //       actionClose={<AlertActionCloseButton onClose={() => ignoreTimedOut()} />}
  //       actionLinks={
  //         <>
  //           <AlertActionLink onClick={() => undefined}>Delete TrustyAI server</AlertActionLink>
  //           <AlertActionLink onClick={() => ignoreTimedOut()}>Close</AlertActionLink>
  //         </>
  //       }
  //     >
  //       <Stack hasGutter>
  //         <StackItem>
  //           We encountered an error creating or loading your TrustyAI server.... more blurb needed.
  //         </StackItem>
  //         <StackItem>To get help contact your administrator.</StackItem>
  //       </Stack>
  //     </Alert>
  //   );
  // }
  //
  // if (serviceLoadError) {
  //   return <p>Service load error: {serviceLoadError.message}</p>;
  // }

  return (
    <>
      hasCr={String(hasCR)} <br />
      apiState={String(apiState.apiAvailable)} <br />
      serverTimedOut={String(serverTimedOut)}
      <br />
      serviceLoadError={String(serviceLoadError?.message)}
      <br />
    </>
  );
};

/*
type ExplainabilityContextProps = {
  hasCR: boolean;
  crInitializing: boolean;
  serverTimedOut: boolean;
  serviceLoadError?: Error;
  ignoreTimedOut: () => void;
  refreshState: () => Promise<undefined>;
  refreshAPIState: () => void;
  apiState: TrustyAPIState;
  data: ExplainabilityContextData;
};
 */

export default TrustyServiceError;
