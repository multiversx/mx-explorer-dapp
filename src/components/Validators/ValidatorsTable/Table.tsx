// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import { faServer } from '@fortawesome/pro-solid-svg-icons/faServer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { DirectioinsType } from './../helpers/validatorHelpers';
import { ValidatorType } from 'context/validators';
import ValidatorStats from './Stats';
import ValidatorTableHead from './Thead';
import ValidatorTableRow from './Trow';
import ValidatorsPager from './ValidatorsPager';
import Tabs from '../Tabs';

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

interface ValidatorsTableType {
  validatorDetails: boolean;
}

const ValidatorsTable = (props: StateType & ValidatorsTableType) => {
  const initialSort: SortType = { field: 'rating', dir: 'desc' };
  const [includeObservers] = React.useState(true);
  const [sort, setSort] = React.useState<SortType>(initialSort);
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);
  const [isInitialRatingDesc, setIsInitialRatingDesc] = React.useState(false);
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

  const mainFilter: { logic: string; filters: {}[] } = { logic: 'and', filters: [] };

  const searchValueFilter = {
    logic: 'or',
    filters:
      searchValue !== ''
        ? [
            { field: 'publicKey', operator: 'contains', value: searchValue },
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

  switch (validatorObserverValue) {
    case 'observer':
      mainFilter.filters.push({
        field: 'peerType',
        operator: 'contains',
        value: validatorObserverValue,
      });
      break;
    case 'issue':
      mainFilter.filters.push({
        field: 'issue',
        operator: 'isnotempty',
      });
      break;
    case 'validator':
      mainFilter.filters.push({
        logic: 'or',
        filters: [
          {
            field: 'peerType',
            operator: 'contains',
            value: 'eligible',
          },
          {
            field: 'peerType',
            operator: 'contains',
            value: 'waiting',
          },
          {
            field: 'peerType',
            operator: 'contains',
            value: 'new',
          },
        ],
      });
      break;
    default:
      mainFilter.filters.push({
        field: 'peerType',
        operator: 'contains',
        value: validatorObserverValue,
      });
      break;
  }

  const data = includeObservers ? validatorsAndObservers : validators;

  const pageSize = 25;

  const dataSource = new kendo.data.DataSource({ data, pageSize });

  dataSource.filter(mainFilter);

  dataSource.sort([sort]);

  dataSource.page(page);

  const newValidators: ValidatorType[] = dataSource.view();

  const getRatings = () => {
    const data = includeObservers ? validatorsAndObservers : validators;
    const uniqueRatings = data
      .sort((a, b) => a.rating - b.rating)
      .reverse()
      .map((v) => v.publicKey);
    setRatingOrder(uniqueRatings);
    setIsInitialRatingDesc(true);
  };

  React.useEffect(getRatings, [validatorsAndObservers, validators, page, includeObservers]);

  const start = (page - 1) * pageSize + (page === 1 ? 1 : 0);

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <Tabs />
            <ValidatorStats
              validatorsAndObservers={validatorsAndObservers}
              validatorObserverValue={validatorObserverValue}
              shownValidatorsLength={dataSource.total()}
              filteredValidatorsLength={newValidators.length}
              setSearchValue={resetPager(setSearchValue)}
              setValidatorObserverValue={resetPager(setValidatorObserverValue)}
            />
            <div className="table-responsive" style={{ minHeight: '290px' }}>
              <table className="table mt-3">
                <ValidatorTableHead
                  sortBy={resetPager(setSort)}
                  total={dataSource.total()}
                  sort={sort}
                  shardData={shardData}
                  shardValue={shardValue}
                  setShardValue={resetPager(setShardValue)}
                  statusValue={statusValue}
                  setStatusValue={resetPager(setStatusValue)}
                  validatorObserverValue={validatorObserverValue}
                  isInitialRatingDesc={isInitialRatingDesc}
                  setIsInitialRatingDesc={setIsInitialRatingDesc}
                />
                <tbody>
                  {newValidators.map((validator, i) => (
                    <ValidatorTableRow
                      key={validator.publicKey}
                      ratingOrder={ratingOrder}
                      rowIndex={i}
                      start={start}
                      validator={validator}
                      validatorDetails={validatorDetails}
                    />
                  ))}
                </tbody>
              </table>
              {dataSource.total() === 0 && (
                <div className="card">
                  <div className="card-body card-details" data-testid="errorScreen">
                    <div className="empty">
                      <FontAwesomeIcon icon={faServer} className="empty-icon" />
                      <span className="h4 empty-heading">No nodes</span>
                    </div>
                  </div>
                </div>
              )}
              <ValidatorsPager
                setPage={setPage}
                total={dataSource.total()}
                page={page}
                start={start}
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
