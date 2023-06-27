import * as React from 'react';
import { Breadcrumb, Bullseye, Button } from '@patternfly/react-core';
import { useNavigate, useParams } from 'react-router-dom';
import { CogIcon } from '@patternfly/react-icons';
import { BreadcrumbItemType } from '~/types';
import ApplicationsPage from '~/pages/ApplicationsPage';
import MetricsPageTabs from '~/pages/modelServing/screens/metrics/MetricsPageTabs';
import { MetricsTabKeys } from '~/pages/modelServing/screens/metrics/types';
import { ExplainabilityContext } from '~/concepts/explainability/ExplainabilityContext';
import { getBreadcrumbItemComponents } from './utils';

type MetricsPageProps = {
  title: string;
  breadcrumbItems: BreadcrumbItemType[];
};

const MetricsPage: React.FC<MetricsPageProps> = ({ title, breadcrumbItems }) => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const {
    hasCR,
    apiState: { apiAvailable },
    data,
    serverTimedOut,
    serviceLoadError,
    crInitializing,
  } = React.useContext(ExplainabilityContext);

  console.log(
    'apiAvailable: %s | hasCR: %s | data: %O | serverTimedOut: %s | serviceLoadError: %s | crInitializing: %s |',
    apiAvailable,
    hasCR,
    data,
    serverTimedOut,
    serviceLoadError,
    crInitializing,
  );

  return (
    <ApplicationsPage
      title={title}
      breadcrumb={<Breadcrumb>{getBreadcrumbItemComponents(breadcrumbItems)}</Breadcrumb>}
      // TODO: decide whether we need to set the loaded based on the feature flag and explainability loaded
      loaded
      description={null}
      empty={false}
      headerAction={
        tab === MetricsTabKeys.BIAS && (
          <Button
            isDisabled={!hasCR || !apiAvailable}
            variant="link"
            icon={<CogIcon />}
            onClick={() => navigate('../configure', { replace: true })}
          >
            Configure
          </Button>
        )
      }
    >
      <MetricsPageTabs />
    </ApplicationsPage>
  );
};

export default MetricsPage;
