import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { isHash, addressIsBech32 } from 'helpers';
import { TransactionFiltersEnum } from 'types';

interface SelectOptionType {
  value: string;
  label: string;
}

export interface SelectFilterType {
  name: string;
  filter: TransactionFiltersEnum;
  options: SelectOptionType[];
  placeholder?: string;
  hasCustomSearch?: boolean;
  hasShowAllOption?: boolean;
  showAllPlaceholder?: string;
  className?: string;
  isMulti?: boolean;
  validation?: 'address' | 'hash';
  noOptionsMessage?: string;
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
  validation,
  noOptionsMessage
}: SelectFilterType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams);
  const existingValue = paramsObject[filter]
    ? paramsObject[filter].split(',')
    : [];

  const updateSelectValue = (selectValue: string) => {
    const paramsObject = Object.fromEntries(searchParams);
    delete paramsObject[filter];

    const nextUrlParams = {
      ...paramsObject,
      ...(selectValue ? { [filter]: selectValue } : {})
    };

    setSearchParams(nextUrlParams);
    document.body.click();
  };

  const hasExistingShowAllOption = options.find(
    (option) => option.label === showAllPlaceholder
  );

  if (hasShowAllOption && !hasExistingShowAllOption) {
    options.push({ value: '', label: showAllPlaceholder });
  }

  return hasCustomSearch ? (
    <Creatable
      options={options}
      name={name}
      data-testid={name}
      className={`styled-select ${className}`}
      classNamePrefix='styled-select'
      placeholder={placeholder}
      createOptionPosition='first'
      formatCreateLabel={(inputValue: string) => `Search for ${inputValue}`}
      isClearable
      onChange={(e) => {
        if (Array.isArray(e) && isMulti) {
          const values = e.map((value) => value.value).join(',');
          updateSelectValue(values);
        } else {
          if ((e as any)?.value !== undefined) {
            updateSelectValue((e as any).value.toString());
          } else {
            updateSelectValue('');
          }
        }
      }}
      defaultValue={options.filter(
        (option) => existingValue.includes(option.value) && existingValue
      )}
      isValidNewOption={(option) => {
        if (validation && option) {
          if (validation === 'address') {
            return addressIsBech32(option);
          }
          if (validation === 'hash') {
            return isHash(option);
          }
        }
        return true;
      }}
      {...(isMulti ? { isMulti: true } : {})}
      noOptionsMessage={(message) => {
        return noOptionsMessage ? <>{noOptionsMessage}</> : <>{message}</>;
      }}
    />
  ) : (
    <Select
      options={options}
      name={name}
      data-testid={name}
      className={`styled-select ${className}`}
      classNamePrefix='styled-select'
      placeholder={placeholder}
      isClearable
      onChange={(e) => {
        if (Array.isArray(e) && isMulti) {
          const values = e.map((value) => value.value).join(',');
          updateSelectValue(values);
        } else {
          if ((e as any)?.value !== undefined) {
            updateSelectValue((e as any).value.toString());
          } else {
            updateSelectValue('');
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
