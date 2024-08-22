import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from 'hooks';
import { faCircleNotch, faSearch } from 'icons/regular';
import { WithClassnameType } from 'types';

export const Search = ({ className }: WithClassnameType) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchHash, setSearchHash] = useState<string>('');
  const { search, isSearching, searchRoute, setSearchRoute } =
    useSearch(searchHash);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      search();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchHash(e.target.value);
  };

  useEffect(() => {
    if (searchRoute) {
      setSearchRoute('');
      setSearchHash('');
      navigate(searchRoute);
    }
  }, [searchRoute, pathname]);

  return (
    <search>
      <form
        className={`main-search w-100 d-flex ${className ?? ''}`}
        noValidate={true}
      >
        <div className='input-group input-group-seamless mb-3'>
          <input
            type='text'
            className='form-control text-truncate'
            placeholder='Search for an address, @herotag, transaction/block hash, validator key or token id'
            name='requestType'
            data-testid='search'
            required
            value={searchHash}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label='Search for an address, @herotag, transaction/block hash, validator key or token id'
            aria-describedby='search-addon'
          />
          <button
            type='submit'
            className='input-group-text'
            onClick={(e) => {
              e.preventDefault();
              search();
            }}
            data-testid='searchButton'
            aria-label='Search'
          >
            {isSearching ? (
              <FontAwesomeIcon
                icon={faCircleNotch}
                spin
                className='me-1 text-primary'
              />
            ) : (
              <FontAwesomeIcon icon={faSearch} className='me-1' />
            )}
          </button>
        </div>
      </form>
    </search>
  );
};
