import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

type ValidatorsStatsType = {
  shownValidatorsLength: number;
  filteredValidatorsLength: number;
  validatorValue: string | undefined;
  includeObservers: boolean;
  setIncludeObsevers: React.Dispatch<React.SetStateAction<boolean>>;
  setValidatorValue: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ValidatorsStats = ({
  shownValidatorsLength,
  filteredValidatorsLength,
  includeObservers,
  setIncludeObsevers,
  validatorValue,
  setValidatorValue,
}: ValidatorsStatsType) => {
  const changeIncludeObsevers: React.ChangeEventHandler<HTMLInputElement> = e => {
    setIncludeObsevers(!includeObservers);
  };
  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValidatorValue(e.target.value);
  };
  return (
    <>
      <div className="float-right">
        <div role="search">
          <div className="input-group input-group-seamless">
            <input
              type="text"
              className="form-control"
              value={validatorValue}
              onChange={changeValidatorValue}
              placeholder="Search"
              name="validatorSearch"
              style={{ borderRadius: '2rem' }}
            />
            <div className="input-group-append">
              {validatorValue !== undefined ? (
                <button
                  type="submit"
                  className="input-group-text"
                  ng-show="!(validatorValue.length > 0)"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              ) : (
                <button
                  type="reset"
                  className="input-group-text"
                  ng-show="validatorValue.length > 0"
                  ng-click="clearValidatorValue()"
                >
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
          Include observers
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
