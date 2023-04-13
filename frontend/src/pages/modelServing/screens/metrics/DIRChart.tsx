import React from 'react';
import { InferenceMetricType } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import TrustyChart from '~/pages/modelServing/screens/metrics/TrustyChart';
import DIRTooltip from '~/pages/modelServing/screens/metrics/DIRTooltip';
import { DomainCalculator } from '~/pages/modelServing/screens/metrics/types';

const DIRChart = () => {
  const domainCalc: DomainCalculator = (maxYValue) => ({
    y: maxYValue > 1.2 ? [0, maxYValue + 0.1] : [0, 1.3],
  });

  return (
    <TrustyChart
      title="Disparate Impact Ratio"
      abbreviation="DIR"
      trustyMetricType={InferenceMetricType.TRUSTY_AI_DIR}
      tooltip={<DIRTooltip />}
      domain={domainCalc}
      thresholds={[1.2, 0.8]}
    />
  );
};

export default DIRChart;
