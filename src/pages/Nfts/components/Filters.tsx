import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';
import { faSearch, faTimes } from 'icons/regular';

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
    const { search, page, size, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(searchValue ? { search: searchValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
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
            name='nftsSearch'
            data-testid='nftsSearch'
          />

          {inputValue ? (
            <button
              type='reset'
              className='input-group-text '
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
  );
};
