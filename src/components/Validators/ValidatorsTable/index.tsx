// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import * as React from 'react';
import { DirectioinsType } from './../helpers/validatorHelpers';
import { ValidatorType } from './../index';
import ValidatorStats from './Stats';
import ValidatorTableHead from './Thead';
import ValidatorTableRow from './Trow';

export interface ComputedShard {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
  shardNumber: number;
}

export interface StateType {
  shardData: ComputedShard[];
  shardsList: string[];
  validators: ValidatorType[];
  validatorsAndObservers: ValidatorType[];
}

export interface SortType {
  field: string;
  dir: DirectioinsType;
}
export type ValidatorValueType = string;

const ValidatorsTable = (
  props: StateType & { validatorDetails: boolean; validatorStatistics: boolean }
) => {
  const [includeObservers, setIncludeObsevers] = React.useState(false);
  const [sort, setSort] = React.useState<SortType>({ field: '', dir: 'none' });
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [shardValue, setShardValue] = React.useState<string>('');
  const [statusValue, setStatusValue] = React.useState<string>('');
  const [validatorObserverValue, setValidatorObserverValue] = React.useState<string>('');
  const { validators, validatorsAndObservers, validatorDetails, shardData } = props;

  const mainFilter: { logic: string; filters: Array<{}> } = { logic: 'and', filters: [] };

  const searchValueFilter = {
    logic: 'or',
    filters:
      searchValue !== ''
        ? [
            { field: 'hexPublicKey', operator: 'contains', value: searchValue },
            { field: 'nodeDisplayName', operator: 'contains', value: searchValue },
            { field: 'versionNumber', operator: 'contains', value: searchValue },
          ]
        : [],
  };

  if (searchValueFilter.filters.length) {
    mainFilter.filters.push(searchValueFilter);
  }

  if (shardValue !== '') {
    mainFilter.filters.push({ field: 'shardId', operator: 'eq', value: shardValue });
  }

  if (statusValue !== '') {
    mainFilter.filters.push({ field: 'isActive', operator: 'eq', value: statusValue === 'online' });
  }

  if (validatorObserverValue !== '') {
    mainFilter.filters.push({
      field: 'isValidator',
      operator: 'eq',
      value: validatorObserverValue === 'validator',
    });
  }

  const data = includeObservers ? validatorsAndObservers : validators;

  const dataSource = new kendo.data.DataSource({ data });

  dataSource.filter(mainFilter);

  dataSource.sort([sort]);

  const newValidators: ValidatorType[] = dataSource.view();

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <ValidatorStats
              shownValidatorsLength={data.length}
              filteredValidatorsLength={newValidators.length}
              setSearchValue={setSearchValue}
              includeObservers={includeObservers}
              setIncludeObsevers={setIncludeObsevers}
              setShardValue={setShardValue}
              setStatusValue={setStatusValue}
              setValidatorObserverValue={setValidatorObserverValue}
            />
            <div className="table-responsive" style={{ minHeight: '290px' }}>
              <table className="table mt-4">
                <ValidatorTableHead
                  includeObservers={includeObservers}
                  sortBy={setSort}
                  sort={sort}
                  shardData={shardData}
                  shardValue={shardValue}
                  setShardValue={setShardValue}
                  statusValue={statusValue}
                  setStatusValue={setStatusValue}
                  validatorObserverValue={validatorObserverValue}
                  setValidatorObserverValue={setValidatorObserverValue}
                  validatorStatistics={props.validatorStatistics}
                />
                <tbody>
                  {newValidators.map(validator => (
                    <ValidatorTableRow
                      key={validator.hexPublicKey}
                      validator={validator}
                      validatorDetails={validatorDetails}
                      validatorStatistics={props.validatorStatistics}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
