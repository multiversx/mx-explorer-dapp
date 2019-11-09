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
  validatorsLength: number;
  validators: ValidatorType[];
  filteredValidatorsLength: number;
  shownValidatorsLength: number;
  validatorsAndObserversLength: number;
};

export type SortType = {
  field: string;
  dir: DirectioinsType;
};

const ValidatorsTable = (props: StateType) => {
  //   dataSource.filter({ field: 'name', operator: 'startswith', value: 'Jane' });
  //   var view = dataSource.view();
  //   console.log(view.length);
  //   console.log(view[0].name);
  const [includeObservers, setIncludeObsevers] = React.useState(false);
  const [sort, setSort] = React.useState<SortType>({ field: '', dir: 'none' });
  const validatorInfosEnabled = false;
  const { filteredValidatorsLength, validators, shownValidatorsLength } = props;
  const dataSource = new kendo.data.DataSource({
    data: validators,
  });
  dataSource.sort([sort]);

  const newValidators: ValidatorType[] = dataSource.view();

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <ValidatorStats
              filteredValidatorsLength={filteredValidatorsLength}
              shownValidatorsLength={shownValidatorsLength}
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
                      validatorInfosEnabled={validatorInfosEnabled}
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
