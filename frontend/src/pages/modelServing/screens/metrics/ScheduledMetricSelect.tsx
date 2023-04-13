import React from 'react';
import { Select, SelectOption } from '@patternfly/react-core';
import { TrustyMetaData } from '~/pages/modelServing/screens/metrics/types';

type ScheduledMetricSelectProps = {
  metadata: TrustyMetaData[];
};
const ScheduledMetricSelect: React.FC<ScheduledMetricSelectProps> = ({ metadata }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>();

  const onToggle = () => setIsOpen(!isOpen);
  const onSelect = (event, selection) => {
    setSelected(selection);
    setIsOpen(false);
  };

  const formatOption = (option: TrustyMetaData) =>
    `Protected Attribute: ${option.protectedAttribute}=${option.protectedValue}, Favorable Output: ${option.favorableOutput}=${option.favorableValue}`;

  return (
    <Select onToggle={onToggle} isOpen={isOpen} onSelect={onSelect} selections={selected}>
      {metadata.map((payload, index) => (
        <SelectOption key={index} value={formatOption(payload)} />
      ))}
    </Select>
  );
};
export default ScheduledMetricSelect;
