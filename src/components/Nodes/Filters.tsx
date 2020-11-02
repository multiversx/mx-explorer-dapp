import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import * as React from 'react';

interface FiltersType {
  resultsCount: number;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setPeerType: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIssues: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  peerType: string | undefined;
  issues: boolean;
}

const Filters = ({
  resultsCount,
  setSearchValue,
  setPeerType,
  setIssues,
  searchValue,
  peerType,
  issues,
}: FiltersType) => {
  const [inputValue, setInputValue] = React.useState<string>(searchValue);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = () => {
    setSearchValue(inputValue);
  };

  const resetValidatorValue = () => {
    setSearchValue('');
    setInputValue('');
  };

  const changeValidatorObserver = (e: any, peerType: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    changePeerType(peerType);
  };

  const changePeerType = (peerType: string) => {
    setIssues(false);
    setPeerType(peerType);
  };

  return (
    <>
      <div className="float-right">
        <div role="search">
          <div className="input-group input-group-seamless">
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={changeValidatorValue}
              onKeyDown={(keyEvent: React.KeyboardEvent) => {
                if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                  updateSearchValue();
                }
              }}
              placeholder="Search"
              name="validatorSearch"
              data-testid="validatorSearch"
              style={{ borderRadius: '2rem' }}
            />
            <div className="input-group-append">
              {inputValue === '' ? (
                <button type="submit" className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              ) : (
                <button
                  type="reset"
                  className="input-group-text"
                  onClick={resetValidatorValue}
                  data-testid="resetSearch"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="float-right mt-2 mr-4">
        {/* {resultsCount
          ? `Showing ${resultsCount.toLocaleString('en')} of ${resultsCount.toLocaleString('en')}`
          : ''} */}
      </div>
      <div className="mt-1">
        <ul className="list-inline">
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${peerType === '' ? 'active' : ''}`}
              onClick={() => {
                changePeerType('');
                window.history.pushState({}, '', '/nodes');
              }}
            >
              All
            </button>
          </li>
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${
                peerType === 'validator' ? 'active' : ''
              }`}
              onClick={() => {
                changePeerType('validator');
              }}
            >
              Validators
            </button>
          </li>
          <li className="list-inline-item">
            <button
              data-testid="filterByObservers"
              className={`btn btn-sm btn-outline-light btn-pill ${
                peerType === 'observer' ? 'active' : ''
              }`}
              onClick={() => {
                changePeerType('observer');
              }}
            >
              Observers
            </button>
          </li>
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${issues ? 'active' : ''}`}
              onClick={() => {
                setIssues(true);
                setPeerType(undefined);
              }}
            >
              Issues
            </button>
          </li>
          <li className="list-inline-item">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-light"
                size="sm"
                className={`btn-pill ${
                  ['eligible', 'waiting', 'new', 'jailed'].includes(String(peerType))
                    ? 'active'
                    : ''
                }`}
                id="more"
              >
                More
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className={`${'eligible' === peerType ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'eligible')}
                >
                  Eligible
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${'waiting' === peerType ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'waiting')}
                >
                  Waiting
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${'new' === peerType ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'new')}
                >
                  New
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${peerType === 'jailed' ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'jailed')}
                >
                  Jailed
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Filters;
