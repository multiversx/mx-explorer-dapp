import React, { useState } from 'react';
import { faSearch, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

export const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { search } = Object.fromEntries(searchParams);
  const [inputValue, setInputValue] = useState<string>(search);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = (searchValue: string) => {
    const { search, page, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(searchValue ? { search: searchValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div className='filters tokens-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
      <div role='search'>
        <div className='input-group input-group-sm input-group-seamless'>
          <input
            type='text'
            className='form-control'
            value={inputValue || ''}
            onChange={changeValidatorValue}
            onKeyDown={(keyEvent: React.KeyboardEvent) => {
              if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                updateSearchValue(inputValue);
              }
            }}
            placeholder='Search'
            name='metaEsdtSearch'
            data-testid='metaEsdtSearch'
          />
          <div className='input-group-append'>
            {inputValue ? (
              <button
                type='reset'
                className='input-group-text'
                onClick={() => {
                  updateSearchValue('');
                }}
                data-testid='resetSearch'
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            ) : (
              <button type='submit' className='input-group-text'>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
