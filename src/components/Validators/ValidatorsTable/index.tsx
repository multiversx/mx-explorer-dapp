// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import * as React from 'react';
import { DirectioinsType } from './../helpers/validatorHelpers';
import { ValidatorType } from './../index';
import ValidatorStats from './Stats';
import ValidatorTableHead from './Thead';
import ValidatorTableRow from './Trow';
import ValidatorsPager from './ValidatorsPager';

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
  const [page, setPage] = React.useState<number>(1);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [shardValue, setShardValue] = React.useState<string>('');
  const [statusValue, setStatusValue] = React.useState<string>('');
  const [validatorObserverValue, setValidatorObserverValue] = React.useState<string>('');
  const { validators, validatorsAndObservers, validatorDetails, shardData } = props;

  const resetPager = (func: any) => (data: any) => {
    if (page !== 1) {
      setPage(1);
    }
    func(data);
  };

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

  const pageSize = 25;

  const dataSource = new kendo.data.DataSource({ data, pageSize });

  dataSource.filter(mainFilter);

  dataSource.sort([sort]);

  dataSource.page(page);

  const newValidators: ValidatorType[] = dataSource.view();

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <ValidatorStats
              shownValidatorsLength={data.length}
              filteredValidatorsLength={newValidators.length}
              setSearchValue={resetPager(setSearchValue)}
              includeObservers={includeObservers}
              setIncludeObsevers={resetPager(setIncludeObsevers)}
              setShardValue={resetPager(setShardValue)}
              setStatusValue={resetPager(setStatusValue)}
              setValidatorObserverValue={resetPager(setValidatorObserverValue)}
            />
            <div className="table-responsive" style={{ minHeight: '290px' }}>
              <table className="table mt-4">
                <ValidatorTableHead
                  includeObservers={includeObservers}
                  sortBy={resetPager(setSort)}
                  sort={sort}
                  shardData={shardData}
                  shardValue={shardValue}
                  setShardValue={resetPager(setShardValue)}
                  statusValue={statusValue}
                  setStatusValue={resetPager(setStatusValue)}
                  validatorObserverValue={validatorObserverValue}
                  setValidatorObserverValue={resetPager(setValidatorObserverValue)}
                  validatorStatistics={props.validatorStatistics}
                />
                <tbody>
                  {newValidators.map((validator, i) => (
                    <ValidatorTableRow
                      key={validator.hexPublicKey}
                      rowIndex={i}
                      validator={validator}
                      validatorDetails={validatorDetails}
                      validatorStatistics={props.validatorStatistics}
                    />
                  ))}
                </tbody>
              </table>
              <ValidatorsPager
                setPage={setPage}
                total={dataSource.total()}
                page={page}
                start={(page - 1) * pageSize + (page === 1 ? 1 : 0)}
                end={
                  (page - 1) * pageSize +
                  (parseInt(newValidators.length.toString()) < pageSize
                    ? parseInt(newValidators.length.toString())
                    : pageSize)
                }
                show={newValidators.length > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
