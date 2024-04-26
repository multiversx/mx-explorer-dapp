import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { formatBigNumber, getStringPlural } from 'helpers';
import { useGetSearch } from 'hooks';
import { faSearch, faTimes } from 'icons/regular';
import { WithClassnameType } from 'types';

export interface TableSearchUIType extends WithClassnameType {
  name?: string;
  searchValue?: string | number;
  placeholderText?: string;
}

export const TableSearch = ({
  name = 'search',
  searchValue,
  placeholderText,
  className
}: TableSearchUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useGetSearch();

  const [inputValue, setInputValue] = useState<string>(search ?? '');
  const [placeholderAddonText, setPlaceholderAddonText] = useState('');

  const changeSearchValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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

  useEffect(() => {
    const searchPlaceholder =
      searchValue && searchValue !== ELLIPSIS
        ? getStringPlural(searchValue, { string: placeholderText })
        : '';
    const placeholderAddonText = search
      ? ''
      : `${
          searchValue && searchValue !== ELLIPSIS
            ? `${formatBigNumber({ value: searchValue })} `
            : ''
        }${searchPlaceholder}`;

    setPlaceholderAddonText(placeholderAddonText);
  }, [searchValue]);

  return (
    <div
      role='search'
      className={classNames(
        'search-md input-group input-group-search input-group-seamless',
        className
      )}
    >
      <input
        type='text'
        className='form-control'
        value={inputValue || ''}
        onChange={changeSearchValue}
        onKeyDown={(keyEvent: React.KeyboardEvent) => {
          if (keyEvent.key === 'Enter') {
            updateSearchValue(inputValue);
          }
        }}
        placeholder={`Search ${placeholderAddonText}`}
        name={name}
        data-testid={name}
      />

      {inputValue ? (
        <button
          type='reset'
          className='input-group-text'
          onClick={() => {
            updateSearchValue('');
            setInputValue('');
            setPlaceholderAddonText('');
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
  );
};
