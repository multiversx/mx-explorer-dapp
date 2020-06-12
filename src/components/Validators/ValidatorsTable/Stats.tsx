import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import * as React from 'react';
import { ValidatorType } from 'context/validators';

interface ValidatorsStatsType {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setValidatorObserverValue: React.Dispatch<React.SetStateAction<string>>;
  shownValidatorsLength: number;
  filteredValidatorsLength: number;
  validatorsAndObservers: ValidatorType[];
  validatorObserverValue: string;
}

const ValidatorsStats = ({
  validatorsAndObservers,
  setSearchValue,
  shownValidatorsLength,
  filteredValidatorsLength,
  setValidatorObserverValue,
  validatorObserverValue,
}: ValidatorsStatsType) => {
  const [inputValue, setInputValue] = React.useState('');

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = e => {
    setInputValue(e.target.value);
    if (e.target.value.length >= 3) {
      setSearchValue(e.target.value.toString().toLowerCase());
    }
    if (e.target.value.length === 0) {
      setSearchValue('');
    }
  };

  const resetValidatorValue = () => {
    setSearchValue('');
    setInputValue('');
  };

  const changeValidatorObserver = (e: any, validatorObs: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setValidatorObserverValue(validatorObs);
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
        {shownValidatorsLength
          ? `Showing ${filteredValidatorsLength.toLocaleString(
              'en'
            )} of ${shownValidatorsLength.toLocaleString('en')}`
          : ''}
      </div>
      <div className="mt-1">
        <ul className="list-inline">
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${
                validatorObserverValue === '' ? 'active' : ''
              }`}
              onClick={() => {
                setValidatorObserverValue('');
              }}
            >
              All
            </button>
          </li>
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${
                validatorObserverValue === 'validator' ? 'active' : ''
              }`}
              onClick={() => {
                setValidatorObserverValue('validator');
              }}
            >
              Validators
            </button>
          </li>
          <li className="list-inline-item">
            <button
              data-testid="filterByObservers"
              className={`btn btn-sm btn-outline-light btn-pill ${
                validatorObserverValue === 'observer' ? 'active' : ''
              }`}
              onClick={() => {
                setValidatorObserverValue('observer');
              }}
            >
              Observers
            </button>
          </li>
          <li className="list-inline-item">
            <button
              className={`btn btn-sm btn-outline-light btn-pill ${
                validatorObserverValue === 'issue' ? 'active' : ''
              }`}
              onClick={() => {
                setValidatorObserverValue('issue');
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
                  ['eligible', 'waiting', 'new', 'jailed'].includes(validatorObserverValue)
                    ? 'active'
                    : ''
                }`}
                id="more"
              >
                More
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className={`${['eligible'].includes(validatorObserverValue) ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'eligible')}
                >
                  Eligible
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${['waiting'].includes(validatorObserverValue) ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'waiting')}
                >
                  Waiting
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${['new'].includes(validatorObserverValue) ? 'active' : ''}`}
                  data-testid="filterByValidators"
                  href="#/validators"
                  onClick={(e: any) => changeValidatorObserver(e, 'new')}
                >
                  New
                </Dropdown.Item>
                <Dropdown.Item
                  className={`${validatorObserverValue === 'jailed' ? 'active' : ''}`}
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

export default ValidatorsStats;
