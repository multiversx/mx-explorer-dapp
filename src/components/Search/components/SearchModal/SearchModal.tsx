import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import { useHandleInput } from 'components/Search/hooks';
import { faCircleNotch, faSearch } from 'icons/regular';
import { searchSelector } from 'redux/selectors';
import { setSearch } from 'redux/slices';
import { WithClassnameType } from 'types';

import { SearchContent } from './SearchContent';

export const SearchModal = ({ className }: WithClassnameType) => {
  const dispatch = useDispatch();

  const { searchQuery, isDataReady } = useSelector(searchSelector);

  const ref: any = useRef(null);
  const inputRef: any = useRef(null);

  const {
    show,
    setShow,
    searchHash,
    handleKeyDown,
    handleChange,
    handleOnClick
  } = useHandleInput({ wrapperRef: ref, inputRef });

  useEffect(() => {
    if (searchQuery && (show || searchHash)) {
      return;
    }

    dispatch(
      setSearch({ search: {}, searchQuery: '', isDataReady: undefined })
    );
  }, [show, searchHash, searchQuery]);

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
            onClick={handleOnClick}
            data-testid='searchButton'
            aria-label='Search'
          >
            {isDataReady === false ? (
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
