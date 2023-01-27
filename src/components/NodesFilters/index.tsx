import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { NetworkLink } from 'components';
import { useNetworkRoute } from 'hooks';

export const NodesFilters = ({
  baseRoute,
  onlySearch
}: {
  baseRoute: string;
  onlySearch?: boolean;
}) => {
  const { search: locationSearch } = useLocation();
  const networkRoute = useNetworkRoute();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(locationSearch);
  const { search, status, issues, type, fullHistory } =
    Object.fromEntries(urlParams);
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
    navigate(networkRoute(`${baseRoute}?${nextUrlParams}`));
  };

  const nodeStatusLink = (statusValue: string) => {
    const { status, type, issues, fullHistory, page, ...rest } =
      Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(statusValue ? { status: statusValue } : {}),
      ...(statusValue && statusValue === 'queued' ? { sort: 'position' } : {})
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const nodeTypeLink = (typeValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const issuesLink = (issuesValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(issuesValue ? { issues: issuesValue, type: 'validator' } : {})
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const fullHistoryLink = (fullHistoryValue: string) => {
    const { type, status, issues, fullHistory, page, ...rest } =
      Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(fullHistoryValue ? { fullHistory: fullHistoryValue } : {})
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  return (
    <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row'>
      {!onlySearch && (
        <ul className='list-inline m-0'>
          <li className='list-inline-item my-1 my-md-0'>
            <NetworkLink
              to={baseRoute}
              className={`badge py-2 px-3 br-lg ${
                [search, status, issues, type].every((el) => el === undefined)
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              All
            </NetworkLink>
          </li>
          <li className='list-inline-item my-1 my-md-0'>
            <NetworkLink
              to={nodeTypeLink('validator')}
              className={`badge py-2 px-3 br-lg ${
                type === 'validator' && issues !== 'true'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Validators
            </NetworkLink>
          </li>
          <li className='list-inline-item my-1 my-md-0'>
            <NetworkLink
              to={nodeTypeLink('observer')}
              data-testid='filterByObservers'
              className={`badge py-2 px-3 br-lg ${
                type === 'observer'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Observers
            </NetworkLink>
          </li>
          <li className='list-inline-item my-1 my-md-0'>
            <NetworkLink
              to={fullHistoryLink('true')}
              data-testid='filterByFullHistory'
              className={`badge py-2 px-3 br-lg ${
                fullHistory ? 'badge-grey' : 'badge-outline badge-outline-grey'
              }`}
            >
              Full History
            </NetworkLink>
          </li>
          <li className='list-inline-item my-1 my-md-0'>
            <NetworkLink
              to={issuesLink('true')}
              className={`badge py-2 px-3 br-lg ${
                issues === 'true'
                  ? 'badge-grey'
                  : 'badge-outline badge-outline-grey'
              }`}
            >
              Issues
            </NetworkLink>
          </li>
          <li className='list-inline-item my-1 my-md-0'>
            <Dropdown className='position-unset'>
              <Dropdown.Toggle
                variant='outline-dark'
                size='sm'
                className={`badge-outline badge-outline-grey py-2 px-3 br-lg me-2 ${
                  [
                    'eligible',
                    'waiting',
                    'new',
                    'jailed',
                    'leaving',
                    'queued',
                    'inactive'
                  ].includes(status)
                    ? 'active'
                    : ''
                }`}
                id='more'
              >
                More
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}
              >
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'eligible' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('eligible')}
                >
                  Eligible
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'waiting' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('waiting')}
                >
                  Waiting
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'new' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('new')}
                >
                  New
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'jailed' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('jailed')}
                >
                  Jailed
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'leaving' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('leaving')}
                >
                  Leaving
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'queued' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('queued')}
                >
                  Queued
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${
                    status === 'inactive' ? 'active' : ''
                  }`}
                  data-testid='filterByValidators'
                  to={nodeStatusLink('inactive')}
                >
                  Inactive
                </NetworkLink>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      )}

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
              name='validatorSearch'
              data-testid='validatorSearch'
            />

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
