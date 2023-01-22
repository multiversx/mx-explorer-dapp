import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkPathname, isHash, addressIsBech32 } from 'helpers';
import { TxFiltersEnum } from 'helpers/types';

export interface SearchFilterType {
  name: string;
  filter: TxFiltersEnum;
  placeholder?: string;
  className?: string;
  validation?: 'address' | 'hash';
}

export const SearchFilter = ({
  name,
  filter,
  placeholder = 'Search',
  className = '',
  validation
}: SearchFilterType) => {
  const navigate = useNavigate();
  const { search: locationSearch } = useLocation();
  const networkPathname = useNetworkPathname();
  const urlParams = new URLSearchParams(locationSearch);
  const paramsObject = Object.fromEntries(urlParams);
  const existingValue = paramsObject[filter] ?? '';

  const [inputValue, setInputValue] = React.useState<string>(existingValue);
  const [errorText, setErrorText] = React.useState<string>('');

  const changeInputValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    setErrorText('');
  };

  const updateUrl = (searchValue: string) => {
    const paramsObject = Object.fromEntries(urlParams);
    delete paramsObject[filter];

    const nextUrlParams = new URLSearchParams({
      ...paramsObject,
      ...(searchValue ? { [filter]: searchValue } : {})
    }).toString();
    navigate(`${networkPathname}?${nextUrlParams}`);
  };

  const updateSearchValue = (searchValue: string) => {
    if (validation && searchValue) {
      if (validation === 'hash') {
        setErrorText(isHash(searchValue) ? '' : 'Invalid Hash');
        if (isHash(searchValue)) {
          updateUrl(searchValue);
        }
      }
      if (validation === 'address') {
        setErrorText(addressIsBech32(searchValue) ? '' : 'Invalid Address');
        if (addressIsBech32(searchValue)) {
          updateUrl(searchValue);
        }
      }
    } else {
      updateUrl(searchValue);
    }
  };

  return (
    <div role='search' className={className}>
      <div
        className={`input-group input-group-seamless ${
          validation ? 'has-validation' : ''
        }`}
      >
        <input
          type='text'
          className='form-control'
          value={inputValue || ''}
          onChange={changeInputValue}
          onKeyDown={(keyEvent: React.KeyboardEvent) => {
            if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
              updateSearchValue(inputValue);
            }
          }}
          placeholder={placeholder}
          name={name}
          data-testid={name}
        />
        <div className='input-group-append'>
          {inputValue && (
            <>
              <button
                type='reset'
                className='input-group-text'
                onClick={() => {
                  setInputValue('');
                }}
                data-testid='resetSearch'
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <span className='group-separator'></span>
            </>
          )}
          <button
            type='submit'
            className='input-group-text outline-0'
            onClick={() => {
              updateSearchValue(inputValue);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {errorText && (
          <div className='invalid-feedback d-block'>{errorText}</div>
        )}
      </div>
    </div>
  );
};
