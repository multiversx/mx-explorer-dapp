import React, { useState } from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Anchor } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

export const NodesFilters = ({
  baseRoute,
  onlySearch
}: {
  baseRoute: string;
  onlySearch?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { search, status, issues, type, fullHistory } =
    Object.fromEntries(searchParams);
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

  const nodeStatusLink = (statusValue: string) => {
    const { status, type, issues, fullHistory, page, ...rest } =
      Object.fromEntries(searchParams);

    const nextUrlParams = {
      ...rest,
      ...(statusValue ? { status: statusValue } : {}),
      ...(statusValue && statusValue === 'queued' ? { sort: 'position' } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const nodeTypeLink = (typeValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const issuesLink = (issuesValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(issuesValue ? { issues: issuesValue, type: 'validator' } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const fullHistoryLink = (fullHistoryValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(fullHistoryValue ? { fullHistory: fullHistoryValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
      {!onlySearch && (
        <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeTypeLink('');
              }}
              className={`badge py-2 px-3 br-lg ${
                [search, status, issues, type, fullHistory].every(
                  (el) => el === undefined
                )
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              All
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeTypeLink('validator');
              }}
              className={`badge py-2 px-3 br-lg ${
                type === 'validator' && issues !== 'true'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Validators
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeTypeLink('observer');
              }}
              data-testid='filterByObservers'
              className={`badge py-2 px-3 br-lg ${
                type === 'observer'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Observers
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                fullHistoryLink('true');
              }}
              data-testid='filterByFullHistory'
              className={`badge py-2 px-3 br-lg ${
                fullHistory ? 'badge-grey' : 'badge-outline badge-outline-grey'
              }`}
            >
              Full History
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                issuesLink('true');
              }}
              className={`badge py-2 px-3 br-lg ${
                issues === 'true'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Issues
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <Dropdown className='position-unset'>
              <Dropdown.Toggle
                variant='outline-dark'
                size='sm'
                className={`badge  py-2 px-3 br-lg ${
                  [
                    'eligible',
                    'waiting',
                    'new',
                    'jailed',
                    'leaving',
                    'queued',
                    'inactive'
                  ].includes(status)
                    ? 'badge-grey'
                    : 'badge-outline badge-outline-grey'
                }`}
                id='more'
              >
                More
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}
              >
                <Dropdown.Item
                  as={Anchor} // This is needed due to issues between threejs, react-bootstrap and typescript, what a time to be alive: https://github.com/react-bootstrap/react-bootstrap/issues/6283
                  className={`dropdown-item ${
                    status === 'eligible' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('eligible');
                    document.body.click();
                  }}
                >
                  Eligible
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'waiting' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('waiting');
                    document.body.click();
                  }}
                >
                  Waiting
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'new' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('new');
                    document.body.click();
                  }}
                >
                  New
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'jailed' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('jailed');
                    document.body.click();
                  }}
                >
                  Jailed
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'leaving' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('leaving');
                    document.body.click();
                  }}
                >
                  Leaving
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'queued' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('queued');
                    document.body.click();
                  }}
                >
                  Queued
                </Dropdown.Item>
                <Dropdown.Item
                  as={Anchor}
                  className={`dropdown-item ${
                    status === 'inactive' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  onClick={() => {
                    nodeStatusLink('inactive');
                    document.body.click();
                  }}
                >
                  Inactive
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      )}
      <div role='search' className='search-filter'>
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
            name='validatorSearch'
            data-testid='validatorSearch'
          />

          {inputValue ? (
            <button
              type='reset'
              className='input-group-text'
              onClick={() => {
                updateSearchValue('');
                setInputValue('');
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
