import type { SingleValue } from 'react-select';

export interface DropdownChartOptionType {
  label: string;
  value: string;
}

export interface DropdownChartPropsType {
  options: DropdownChartOptionType[];
  value?: DropdownChartOptionType;
  onChange: (option: SingleValue<DropdownChartOptionType>) => void;
}
