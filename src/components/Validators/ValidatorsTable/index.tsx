import * as React from 'react';
// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import ValidatorStats from './Stats';
import ValidatorTableHead from './Thead';
import ValidatorTableRow from './Trow';
import { ValidatorType } from './../index';
import { DirectioinsType } from './../helpers/validatorHelpers';

type ComputedShard = {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
};

export type StateType = {
  shardData: ComputedShard[];
  shardsList: string[];
  validators: ValidatorType[];
  validatorsAndObservers: ValidatorType[];
};

export type SortType = {
  field: string;
  dir: DirectioinsType;
};
export type ValidatorValueType = string;

const ValidatorsTable = (props: StateType & { validatorDetails: boolean }) => {
  const [includeObservers, setIncludeObsevers] = React.useState(false);
  const [sort, setSort] = React.useState<SortType>({ field: '', dir: 'none' });
  const [validatorValue, setValidatorValue] = React.useState<string>('');
  const { validators, validatorsAndObservers, validatorDetails } = props;

  const filter =
    validatorValue !== ''
      ? {
          logic: 'or',
          filters: [
            { field: 'hexPublicKey', operator: 'contains', value: validatorValue },
            { field: 'nodeDisplayName', operator: 'contains', value: validatorValue },
            { field: 'versionNumber', operator: 'contains', value: validatorValue },
          ],
        }
      : [];

  const data = includeObservers ? validatorsAndObservers : validators;

  const dataSource = new kendo.data.DataSource({ data });

  dataSource.sort([sort]);
  dataSource.filter(filter);

  const newValidators: ValidatorType[] = dataSource.view();

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <ValidatorStats
              shownValidatorsLength={data.length}
              filteredValidatorsLength={newValidators.length}
              setValidatorValue={setValidatorValue}
              includeObservers={includeObservers}
              setIncludeObsevers={setIncludeObsevers}
            />
            <div className="table-responsive" style={{ minHeight: '290px' }}>
              <table className="table mt-4">
                <ValidatorTableHead
                  includeObservers={includeObservers}
                  sortBy={setSort}
                  sort={sort}
                />
                <tbody>
                  {newValidators.map(validator => (
                    <ValidatorTableRow
                      key={validator.hexPublicKey}
                      validator={validator}
                      validatorDetails={validatorDetails}
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
