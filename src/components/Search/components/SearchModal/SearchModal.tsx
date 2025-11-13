import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate, useLocation } from 'react-router-dom';

import { NAVIGATION_SEARCH_STATE } from 'appConstants';
import { useSearch } from 'hooks';
import { faCircleNotch, faSearch } from 'icons/regular';
import { WithClassnameType } from 'types';

import { SearchContent } from './SearchContent';
import {
  handleArrowDown,
  handleArrowUp
} from 'components/Search/helpers/handleArrowAction';
import { useOutsideClick } from 'components/Search/helpers/handleOutsideClick';

export const SearchModal = ({ className }: WithClassnameType) => {
  const ref: any = useRef(null);
  const inputRef: any = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [searchHash, setSearchHash] = useState<string>('');
  const { search, isSearching, setIsSearching } = useSearch(searchHash);

  const [index, setIndex] = useState(0);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const list = await search();
      console.log('--list', list);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIndex(0);
      setShow(false);
      setSearchHash('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchHash(e.target.value);
    if (e.target.value && !show) {
      setShow(true);
    }
  };

  useHotkeys(['/', 'shift+/'], (ev) => {
    if (show) {
      return;
    }
    inputRef?.current?.focus?.();
    setShow(true);
    ev.preventDefault();
  });
  useHotkeys('Escape', (ev) => {
    if (!show) {
      return;
    }
    setShow(false);
    setIndex(0);
    setSearchHash('');
    ev.preventDefault();
  });
  useHotkeys('down', () => handleArrowDown(index, setIndex), {
    enableOnFormTags: true
  });
  useHotkeys('up', () => handleArrowUp(index, setIndex), {
    enableOnFormTags: true
  });

  useOutsideClick(
    ref.current,
    () => {
      setShow(false);
      setIndex(0);
      setSearchHash('');
    },
    [ref.current]
  );

  return (
    <search className='search' ref={ref}>
      <form
        className={`main-search w-100 d-flex ${className ?? ''}`}
        noValidate={true}
      >
        <div className='input-group input-group-seamless mb-3'>
          <input
            ref={inputRef}
            type='text'
            className='form-control text-truncate'
            placeholder='Search for an address, @herotag, transaction/block hash, validator key or token id'
            name='requestType'
            data-testid='search'
            required
            value={searchHash}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShow(true)}
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
      {show && <SearchContent />}
    </search>
  );
};
