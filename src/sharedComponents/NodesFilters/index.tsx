import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NetworkLink } from 'sharedComponents';
import { useNetworkRoute } from 'helpers';

const NodesFilters = ({ baseRoute, onlySearch }: { baseRoute: string; onlySearch?: boolean }) => {
  const { search: locationSearch } = useLocation();
  const networkRoute = useNetworkRoute();
  const history = useHistory();
  const urlParams = new URLSearchParams(locationSearch);
  const { search, status, issues, type } = Object.fromEntries(urlParams);
  const [inputValue, setInputValue] = React.useState<string>(search);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = (searchValue: string) => {
    const { search, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(searchValue ? { search: searchValue } : {}),
    }).toString();
    history.push(networkRoute(`${baseRoute}?${nextUrlParams}`));
  };

  const nodeStatusLink = (statusValue: string) => {
    const { status, type, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(statusValue ? { status: statusValue } : {}),
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const nodeTypeLink = (typeValue: string) => {
    const { type, status, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(typeValue ? { type: typeValue } : {}),
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  const issuesLink = (issuesValue: string) => {
    const { type, status, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(issuesValue ? { issues: issuesValue, type: 'validator' } : {}),
    }).toString();
    return `${baseRoute}?${nextUrlParams}`;
  };

  return (
    <div className="nodes-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row">
      {!onlySearch && (
        <ul className="list-inline m-0">
          <li className="list-inline-item my-1 my-md-0">
            <NetworkLink
              to={baseRoute}
              className={`btn btn-sm btn-outline-light btn-pill ${
                [search, status, issues, type].every((el) => el === undefined) ? 'active' : ''
              }`}
            >
              All
            </NetworkLink>
          </li>
          <li className="list-inline-item my-1 my-md-0">
            <NetworkLink
              to={nodeTypeLink('validator')}
              className={`btn btn-sm btn-outline-light btn-pill ${
                type === 'validator' && issues !== 'true' ? 'active' : ''
              }`}
            >
              Validators
            </NetworkLink>
          </li>
          <li className="list-inline-item my-1 my-md-0">
            <NetworkLink
              to={nodeTypeLink('observer')}
              data-testid="filterByObservers"
              className={`btn btn-sm btn-outline-light btn-pill ${
                type === 'observer' ? 'active' : ''
              }`}
            >
              Observers
            </NetworkLink>
          </li>
          <li className="list-inline-item my-1 my-md-0">
            <NetworkLink
              to={issuesLink('true')}
              className={`btn btn-sm btn-outline-light btn-pill ${
                issues === 'true' ? 'active' : ''
              }`}
            >
              Issues
            </NetworkLink>
          </li>
          <li className="list-inline-item my-1 my-md-0">
            <Dropdown className="position-unset">
              <Dropdown.Toggle
                variant="outline-light"
                size="sm"
                className={`btn-pill mr-2 ${
                  ['eligible', 'waiting', 'new', 'jailed'].includes(status) ? 'active' : ''
                }`}
                id="more"
              >
                More
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}>
                <NetworkLink
                  className={`dropdown-item ${status === 'eligible' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('eligible')}
                >
                  Eligible
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${status === 'waiting' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('waiting')}
                >
                  Waiting
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${status === 'new' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('new')}
                >
                  New
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${status === 'jailed' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('jailed')}
                >
                  Jailed
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${status === 'leaving' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('leaving')}
                >
                  Leaving
                </NetworkLink>
                <NetworkLink
                  className={`dropdown-item ${status === 'queued' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  to={nodeStatusLink('queued')}
                >
                  Queued
                </NetworkLink>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      )}

      <div className="my-1 my-md-0">
        <div role="search">
          <div className="input-group input-group-seamless">
            <input
              type="text"
              className="form-control rounded-pill"
              value={inputValue || ''}
              onChange={changeValidatorValue}
              onKeyDown={(keyEvent: React.KeyboardEvent) => {
                if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                  updateSearchValue(inputValue);
                }
              }}
              placeholder="Search"
              name="validatorSearch"
              data-testid="validatorSearch"
            />
            <div className="input-group-append">
              {inputValue ? (
                <button
                  type="reset"
                  className="input-group-text side-action"
                  onClick={() => {
                    updateSearchValue('');
                  }}
                  data-testid="resetSearch"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              ) : (
                <button type="submit" className="input-group-text side-action outline-0">
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

export default NodesFilters;
