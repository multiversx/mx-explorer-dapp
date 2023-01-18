import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { useNetworkPathname } from 'helpers';

interface SelectOptionType {
  value: string;
  label: string;
}

export interface SelectFilterType {
  name: string;
  filter: string;
  options: SelectOptionType[];
  placeholder?: string;
  hasCustomSearch?: boolean;
  hasShowAllOption?: boolean;
  showAllPlaceholder?: string;
  className?: string;
  isMulti?: boolean;
}

export const SelectFilter = ({
  name,
  filter,
  options,
  placeholder = 'Select...',
  className = '',
  hasCustomSearch = false,
  hasShowAllOption = true,
  isMulti = false,
  showAllPlaceholder = 'Show All',
}: SelectFilterType) => {
  const history = useHistory();
  const { search: locationSearch } = useLocation();
  const networkPathname = useNetworkPathname();
  const urlParams = new URLSearchParams(locationSearch);
  const paramsObject = Object.fromEntries(urlParams);
  const existingValue = paramsObject[filter] ? paramsObject[filter].split(',') : [];

  const updateSelectValue = (selectValue: string) => {
    const paramsObject = Object.fromEntries(urlParams);
    delete paramsObject[filter];

    const nextUrlParams = new URLSearchParams({
      ...paramsObject,
      ...(selectValue ? { [filter]: selectValue } : {}),
    }).toString();
    history.push(`${networkPathname}?${nextUrlParams}`);
  };

  const hasExistingShowAllOption = options.find((option) => option.label === showAllPlaceholder);

  if (hasShowAllOption && !hasExistingShowAllOption) {
    options.push({ value: '', label: showAllPlaceholder });
  }

  return hasCustomSearch ? (
    <Creatable
      options={options}
      name={name}
      data-testid={name}
      className={`styled-select ${className}`}
      classNamePrefix="styled-select"
      placeholder={placeholder}
      createOptionPosition="first"
      formatCreateLabel={(inputValue: string) => `Search for ${inputValue}`}
      isClearable
      onChange={(e) => {
        if (Array.isArray(e) && isMulti) {
          const values = e.map((value) => value.value).join(',');
          updateSelectValue(values);
        } else {
          if (e?.value !== undefined) {
            updateSelectValue(e.value.toString());
          }
        }
      }}
      defaultValue={options.filter(
        (option) => existingValue.includes(option.value) && existingValue
      )}
      {...(isMulti ? { isMulti: true } : {})}
    />
  ) : (
    <Select
      options={options}
      name={name}
      data-testid={name}
      className={`styled-select ${className}`}
      classNamePrefix="styled-select"
      placeholder={placeholder}
      isClearable
      onChange={(e) => {
        if (Array.isArray(e) && isMulti) {
          const values = e.map((value) => value.value).join(',');
          updateSelectValue(values);
        } else {
          if (e?.value !== undefined) {
            updateSelectValue(e.value.toString());
          }
        }
      }}
      defaultValue={options.filter(
        (option) => existingValue.includes(option.value) && existingValue
      )}
      {...(isMulti ? { isMulti: true } : {})}
    />
  );
};
