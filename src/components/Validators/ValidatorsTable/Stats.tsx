import * as React from 'react';

type ValidatorsStatsType = {
  shownValidatorsLength: number;
  filteredValidatorsLength: number;
  includeObservers: boolean;
  setIncludeObsevers: React.Dispatch<React.SetStateAction<boolean>>;
};

const ValidatorsStats = ({
  shownValidatorsLength,
  filteredValidatorsLength,
  includeObservers,
  setIncludeObsevers,
}: ValidatorsStatsType) => {
  const changeIncludeObsevers: React.ChangeEventHandler<HTMLInputElement> = e => {
    setIncludeObsevers(!includeObservers);
  };
  return (
    <>
      <div className="float-right">
        <div role="search">
          <div className="input-group input-group-seamless">
            <input
              type="text"
              className="form-control"
              ng-model="validatorValue"
              ng-change="filterValidators()"
              placeholder="Search"
              name="validatorSearch"
              style={{ borderRadius: '2rem' }}
              required
            />
            <div className="input-group-append">
              <button
                type="submit"
                className="input-group-text"
                ng-show="!(validatorValue.length > 0)"
              >
                <i className="fa fa-search" />
              </button>
              <button
                type="reset"
                className="input-group-text"
                ng-show="validatorValue.length > 0"
                ng-click="clearValidatorValue()"
              >
                <i className="fa fa-times" />
              </button>
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
