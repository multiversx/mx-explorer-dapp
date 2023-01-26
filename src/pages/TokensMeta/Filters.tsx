import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';

export const Filters = () => {
  const { search: locationSearch } = useLocation();

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(locationSearch);
  const { search } = Object.fromEntries(urlParams);
  const [inputValue, setInputValue] = React.useState<string>(search);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = (searchValue: string) => {
    const { search, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(searchValue ? { search: searchValue } : {})
    }).toString();
    navigate(`/meta-tokens?${nextUrlParams}`);
  };

  return (
    <div className='tokens-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row'>
      <div className='my-1 my-md-0'>
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
    </div>
  );
};
