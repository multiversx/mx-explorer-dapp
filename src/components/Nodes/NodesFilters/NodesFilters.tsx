import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Anchor } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { faSearch, faTimes } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { SortOrderEnum } from 'types';

export const NodesFilters = ({ onlySearch }: { onlySearch?: boolean }) => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);
  const [searchParams, setSearchParams] = useSearchParams();

  const { search, status, issues, type, fullHistory } =
    Object.fromEntries(searchParams);
  const [inputValue, setInputValue] = useState<string>(search);

  const isMoreActive = [
    'eligible',
    'waiting',
    'new',
    'jailed',
    'leaving',
    'queued',
    'inactive',
    'auction'
  ].includes(status);

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

  const nodeStatusLink = (statusValue: string) => {
    const {
      status,
      type,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);

    const nextUrlParams: { [k: string]: string } = {
      ...rest,
      ...(statusValue ? { status: statusValue } : {})
    };

    if (statusValue === 'queued') {
      nextUrlParams.sort = 'position';
      nextUrlParams.order = SortOrderEnum.asc;
    }
    if (statusValue === 'auction') {
      nextUrlParams.sort = 'auctionPosition';
      nextUrlParams.order = SortOrderEnum.asc;
    }
    setSearchParams(nextUrlParams);
  };

  const nodeTypeLink = (typeValue: string) => {
    const {
      type,
      status,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const issuesLink = (issuesValue: boolean) => {
    const {
      type,
      status,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(issuesValue ? { issues: String(issuesValue), type: 'validator' } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const fullHistoryLink = (fullHistoryValue: boolean) => {
    const {
      type,
      status,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(fullHistoryValue ? { fullHistory: String(fullHistoryValue) } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
      {!onlySearch && (
        <menu className='list-inline m-0 d-flex flex-wrap gap-2'>
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
                fullHistoryLink(true);
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
                issuesLink(true);
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
                className={`badge py-2 px-3 br-lg nodes-more ${
                  isMoreActive
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
                {queueSize !== undefined && (
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
                )}
                {auctionValidators !== undefined && (
                  <Dropdown.Item
                    as={Anchor}
                    className={`dropdown-item ${
                      status === 'auction' ? 'active' : ''
                    }`}
                    data-testid='filterByValidators'
                    onClick={() => {
                      nodeStatusLink('auction');
                      document.body.click();
                    }}
                  >
                    Auction List
                  </Dropdown.Item>
                )}
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
        </menu>
      )}
      <div role='search' className={onlySearch ? 'search-lg' : 'search-sm'}>
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
