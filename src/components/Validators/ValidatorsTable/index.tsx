import * as React from 'react';
// @ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import ValidatorStats from './Stats';
import ValidatorTableHead from './Thead';
import ValidatorTableRow from './Trow';
import { ValidatorType } from './../index';
import { DirectioinsType } from './../helpers/validatorHelpers';

const dummyValidators = [
  {
    hexPublicKey:
      '8f2756c3dbe37c9a249f0e1472f80f8142126c09ee77608e1e61e6e1aa2b6d786ef891653db163e3fa55e70e94cdf37f359c25edccd44773e6acd3a2c9ebb1154c758845a6034625104427bd9343b5db7c65e4df13a7cbe2b123e461e3deeccb3b79594d347a3cad1a8ce0162ed3aa2995bfd455f3fbe9a94b37e699523b8cc5',
    timeStamp: '2019-11-11T01:09:27.087612314Z',
    maxInactiveTime: '10h52m1.053426244s',
    isActive: false,
    receivedShardID: 4,
    computedShardID: 4,
    totalUpTimeSec: 495073,
    totalDownTimeSec: 41414,
    versionNumber: 'v2.0.38-0-gc817ab31-dirty/go1.13.4/linux-amd64',
    isValidator: true,
    nodeDisplayName: 'frankf1957 (San Francisco)',
    shardId: '4',
    shardNumber: 4,
    star: false,
  },
  {
    hexPublicKey:
      '8f2873e1bef8e51a9854b4926dcd63e2598dae179d2593ef76677b39dd910fa21bafbaecf2ce13896576371a451df6c3cbdd4361144c7a8cca43a61bfdd86af459d9f78eeb87b29336843383818d1d01516f00b4c9d345a6ba20be2e89618c3a3cb2d09b7a888166a0ca09d86e45722af926d7cf38e2039932879813162f367b',
    timeStamp: '2019-11-11T01:30:49.57853689Z',
    maxInactiveTime: '10h30m38.562357766s',
    isActive: false,
    receivedShardID: 4294967295,
    computedShardID: 4294967295,
    totalUpTimeSec: 495647,
    totalDownTimeSec: 40841,
    versionNumber: 'v3.0.38-0-gc817ab31-dirty/go1.13.4/linux-amd64',
    isValidator: true,
    nodeDisplayName: 'frankf1957 (Bangalore, India)',
    shardId: 'Metachain',
    shardNumber: 4294967295,
    star: false,
  },
  {
    hexPublicKey:
      '8f76f6296e860464447f28c910f88189fd1767c8a325150da6c8de6698eda0945ed681920462a5a32414f277878b0d9836f829058eacef9f800cc5d23e15d56689d78f97189ae72d243e6cbd23bca6367346c0efbd26d8f8d9f7525d8f45e7c384745a4230cdf630287e5b9aa2fc9606443268d12d48f1338b8d9cdb2eccbce2',
    timeStamp: '2019-11-11T11:21:18.595108602Z',
    maxInactiveTime: '40m9.545504921s',
    isActive: false,
    receivedShardID: 2,
    computedShardID: 2,
    totalUpTimeSec: 534378,
    totalDownTimeSec: 2109,
    versionNumber: 'v1.0.38-0-gc817ab31-dirty/go1.13.4/windows-amd64',
    isValidator: true,
    nodeDisplayName: 'dexterasul',
    shardId: '2',
    shardNumber: 2,
    star: false,
  },
];

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
export type ValidatorValueType = string;

const ValidatorsTable = (props: StateType) => {
  const [includeObservers, setIncludeObsevers] = React.useState(false);
  const [sort, setSort] = React.useState<SortType>({ field: '', dir: 'none' });
  const [validatorValue, setValidatorValue] = React.useState<string>('');
  const validatorInfosEnabled = false;
  const { filteredValidatorsLength, validators, shownValidatorsLength } = props;

  console.log(validators.slice(validators.length - 3));

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

  const dataSource = new kendo.data.DataSource({
    data: validators,
  });

  dataSource.sort([sort]);
  dataSource.filter(filter);

  const newValidators: ValidatorType[] = dataSource.view();

  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-list">
            <ValidatorStats
              setValidatorValue={setValidatorValue}
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
