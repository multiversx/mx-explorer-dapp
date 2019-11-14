import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

type ValidatorsStatsType = {
  includeObservers: boolean;
  setIncludeObsevers: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setShardValue: React.Dispatch<React.SetStateAction<string>>;
  setStatusValue: React.Dispatch<React.SetStateAction<string>>;
  setValidatorObserverValue: React.Dispatch<React.SetStateAction<string>>;
  shownValidatorsLength: number;
  filteredValidatorsLength: number;
};

const ValidatorsStats = ({
  includeObservers,
  setIncludeObsevers,
  setSearchValue,
  shownValidatorsLength,
  filteredValidatorsLength,
  setShardValue,
  setStatusValue,
  setValidatorObserverValue,
}: ValidatorsStatsType) => {
  const changeIncludeObsevers: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIncludeObsevers(!includeObservers);
    setShardValue('');
    setStatusValue('');
    setValidatorObserverValue('');
  };

  const [inputValue, setInputValue] = React.useState('');

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = e => {
    setInputValue(e.target.value);
    if (e.target.value.length >= 3) setSearchValue(e.target.value.toString().toLowerCase());
    if (e.target.value.length === 0) setSearchValue('');
  };

  const resetValidatorValue = () => {
    setSearchValue('');
    setInputValue('');
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
              style={{ borderRadius: '2rem' }}
            />
            <div className="input-group-append">
              {inputValue === '' ? (
                <button
                  type="submit"
                  className="input-group-text"
                  ng-show="!(validatorValue.length > 0)"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              ) : (
                <button type="reset" className="input-group-text" onClick={resetValidatorValue}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="float-right mt-2 mr-4">
        <label>
          <input
            type="checkbox"
            name="checkbox"
            checked={includeObservers}
            onChange={changeIncludeObsevers}
          />
          &nbsp; Include observers
        </label>
      </div>
      <div className="mt-2 d-none d-md-block">
        {shownValidatorsLength
          ? 'Showing ' +
            filteredValidatorsLength.toLocaleString('en') +
            ' of ' +
            shownValidatorsLength.toLocaleString('en')
          : ''}
      </div>
    </>
  );
};

export default ValidatorsStats;
