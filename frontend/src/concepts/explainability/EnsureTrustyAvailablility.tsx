import { Bullseye, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';

type EnsureTrustyAvailabilityProps = {
  children: React.ReactNode;
};

const EnsureTrustyAvailability: React.FC<EnsureTrustyAvailabilityProps> = ({ children }) => {
  const { apiState } = React.useContext(ExplainabilityContext);

  if (!apiState.apiAvailable) {
    return (
      <Bullseye style={{ minHeight: 150 }}>
        <Spinner />
      </Bullseye>
    );
  }

  return <>{children}</>;
};

export default EnsureTrustyAvailability;
