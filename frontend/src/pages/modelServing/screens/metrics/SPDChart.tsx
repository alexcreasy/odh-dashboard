import React from 'react';
import { InferenceMetricType } from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import TrustyChart from '~/pages/modelServing/screens/metrics/TrustyChart';
import SPDTooltip from '~/pages/modelServing/screens/metrics/SPDTooltip';
import { DomainCalculator } from '~/pages/modelServing/screens/metrics/types';

const SPDChart = () => {
  const domainCalc: DomainCalculator = (maxYValue) => ({
    y: maxYValue > 0.1 ? [-1 * maxYValue - 0.1, maxYValue + 0.1] : [-0.2, 0.2],
  });

  return (
    <TrustyChart
      title="Statistical Parity Difference"
      abbreviation="SPD"
      metricType={InferenceMetricType.TRUSTY_AI_SPD}
      tooltip={<SPDTooltip />}
      domain={domainCalc}
      thresholds={[0.1, -0.1]}
    />
  );
};
export default SPDChart;
