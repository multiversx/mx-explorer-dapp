import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NetworkLink } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { useNetworkRoute } from 'helpers';

const Filters = () => {
  const { search: locationSearch } = useLocation();

  const networkRoute = useNetworkRoute();
  const history = useHistory();
  const urlParams = new URLSearchParams(locationSearch);
  const { search, peerType, issues, nodeType } = Object.fromEntries(urlParams);
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
    history.push(networkRoute(`${validatorsRoutes.nodes}?${nextUrlParams}`));
  };

  const peerTypeLink = (peerTypeValue: string) => {
    const { peerType, nodeType, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(peerTypeValue ? { peerType: peerTypeValue } : {}),
    }).toString();
    return `${validatorsRoutes.nodes}?${nextUrlParams}`;
  };

  const nodeTypeLink = (nodeTypeValue: string) => {
    const { nodeType, peerType, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(nodeTypeValue ? { nodeType: nodeTypeValue } : {}),
    }).toString();
    return `${validatorsRoutes.nodes}?${nextUrlParams}`;
  };

  const issuesLink = (issuesValue: string) => {
    const { nodeType, peerType, issues, page, ...rest } = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(issuesValue ? { issues: issuesValue, nodeType: 'validator' } : {}),
    }).toString();
    return `${validatorsRoutes.nodes}?${nextUrlParams}`;
  };

  return (
    <div className="nodes-filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row">
      <ul className="list-inline m-0">
        <li className="list-inline-item my-1 my-md-0">
          <NetworkLink
            to={validatorsRoutes.nodes}
            className={`btn btn-sm btn-outline-light btn-pill ${
              [search, peerType, issues, nodeType].every((el) => el === undefined) ? 'active' : ''
            }`}
          >
            All
          </NetworkLink>
        </li>
        <li className="list-inline-item my-1 my-md-0">
          <NetworkLink
            to={nodeTypeLink('validator')}
            className={`btn btn-sm btn-outline-light btn-pill ${
              nodeType === 'validator' && issues !== 'true' ? 'active' : ''
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
              nodeType === 'observer' ? 'active' : ''
            }`}
          >
            Observers
          </NetworkLink>
        </li>
        <li className="list-inline-item my-1 my-md-0">
          <NetworkLink
            to={issuesLink('true')}
            className={`btn btn-sm btn-outline-light btn-pill ${issues === 'true' ? 'active' : ''}`}
          >
            Issues
          </NetworkLink>
        </li>
        <li className="list-inline-item my-1 my-md-0">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-light"
              size="sm"
              className={`btn-pill ${
                ['eligible', 'waiting', 'new', 'jailed'].includes(peerType) ? 'active' : ''
              }`}
              id="more"
            >
              More
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <NetworkLink
                className={`dropdown-item ${peerType === 'eligible' ? 'active' : ''}`}
                data-testid="filterByValidators"
                to={peerTypeLink('eligible')}
              >
                Eligible
              </NetworkLink>
              <NetworkLink
                className={`dropdown-item ${peerType === 'waiting' ? 'active' : ''}`}
                data-testid="filterByValidators"
                to={peerTypeLink('waiting')}
              >
                Waiting
              </NetworkLink>
              <NetworkLink
                className={`dropdown-item ${peerType === 'new' ? 'active' : ''}`}
                data-testid="filterByValidators"
                to={peerTypeLink('new')}
              >
                New
              </NetworkLink>
              <NetworkLink
                className={`dropdown-item ${peerType === 'jailed' ? 'active' : ''}`}
                data-testid="filterByValidators"
                to={peerTypeLink('jailed')}
              >
                Jailed
              </NetworkLink>
              <NetworkLink
                className={`dropdown-item ${peerType === 'leaving' ? 'active' : ''}`}
                data-testid="filterByValidators"
                to={peerTypeLink('leaving')}
              >
                Leaving
              </NetworkLink>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>

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

export default Filters;
