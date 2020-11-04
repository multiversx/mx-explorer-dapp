import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import * as React from 'react';
import { FiltersType } from './helpers/useFilters';
interface FiltersInterface {
  resultsCount: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPeerType: React.Dispatch<React.SetStateAction<FiltersType['peerType']>>;
  setIssues: React.Dispatch<React.SetStateAction<FiltersType['issues']>>;
  setNodeType: React.Dispatch<React.SetStateAction<FiltersType['nodeType']>>;
  nodeType: FiltersType['nodeType'];
  search: string;
  peerType: FiltersType['peerType'];
  issues: FiltersType['issues'];
}

const Filters = ({
  resultsCount,
  setSearch,
  setPeerType,
  peerType,
  setNodeType,
  nodeType,
  setIssues,
  search,
  issues,
}: FiltersInterface) => {
  const [inputValue, setInputValue] = React.useState<string>(search);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = () => {
    setSearch(inputValue);
  };

  const resetValidatorValue = () => {
    setSearch('');
    setInputValue('');
  };

  const changeValidatorObserver = (peerType: FiltersType['peerType']) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    changePeerType(peerType);
  };

  const changeNodeType = (nodeType: FiltersType['nodeType']) => () => {
    changePeerType('');
    setNodeType(nodeType);
  };

  const changePeerType = (peerType: FiltersType['peerType']) => {
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

      <ul className="list-inline m-0">
        <li className="list-inline-item">
          <button
            className={`btn btn-sm btn-outline-light btn-pill ${peerType === '' ? 'active' : ''}`}
            onClick={changeNodeType('')}
          >
            All
          </button>
        </li>
        <li className="list-inline-item">
          <button
            className={`btn btn-sm btn-outline-light btn-pill ${
              nodeType === 'validator' ? 'active' : ''
            }`}
            onClick={changeNodeType('validator')}
          >
            Validators
          </button>
        </li>
        <li className="list-inline-item">
          <button
            data-testid="filterByObservers"
            className={`btn btn-sm btn-outline-light btn-pill ${
              nodeType === 'observer' ? 'active' : ''
            }`}
            onClick={changeNodeType('observer')}
          >
            Observers
          </button>
        </li>
        <li className="list-inline-item">
          <button
            className={`btn btn-sm btn-outline-light btn-pill ${issues ? 'active' : ''}`}
            onClick={() => {
              setIssues(true);
              setPeerType('');
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
                ['eligible', 'waiting', 'new', 'jailed'].includes(String(peerType)) ? 'active' : ''
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
                onClick={changeValidatorObserver('eligible')}
              >
                Eligible
              </Dropdown.Item>
              <Dropdown.Item
                className={`${'waiting' === peerType ? 'active' : ''}`}
                data-testid="filterByValidators"
                href="#/validators"
                onClick={changeValidatorObserver('waiting')}
              >
                Waiting
              </Dropdown.Item>
              <Dropdown.Item
                className={`${'new' === peerType ? 'active' : ''}`}
                data-testid="filterByValidators"
                href="#/validators"
                onClick={changeValidatorObserver('new')}
              >
                New
              </Dropdown.Item>
              <Dropdown.Item
                className={`${peerType === 'jailed' ? 'active' : ''}`}
                data-testid="filterByValidators"
                href="#/validators"
                onClick={changeValidatorObserver('jailed')}
              >
                Jailed
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </>
  );
};

export default Filters;
