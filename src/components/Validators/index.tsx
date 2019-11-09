import * as React from 'react';
import kendo from 'kendo-ui-core';
import { Highlights } from './../../sharedComponents';
import { useGlobalState } from '../../context';
import { getValidatorsData } from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import ShardsList from './ShardsList';
import ValidatorsTable from './ValidatorsTable';

console.log(kendo.data);

export type ValidatorType = {
  computedShardID: number;
  hexPublicKey: string;
  isActive: boolean;
  isValidator: boolean;
  maxInactiveTime: string;
  nodeDisplayName: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId?: string;
  shardNumber?: number;
  star?: boolean;
};

export type ShardDataType = {
  [key: string]: {
    allValidators: number;
    allActiveValidators: number;
  };
};

const initialState = {
  shardData: [
    {
      shardID: '',
      status: '',
      allValidators: 0,
      allActiveValidators: 0,
    },
  ],
  shardsList: [''],
  validatorsLength: 0,
  filteredValidators: [
    {
      computedShardID: 0,
      hexPublicKey: '',
      isActive: false,
      isValidator: false,
      maxInactiveTime: '',
      nodeDisplayName: '',
      receivedShardID: 0,
      timeStamp: '',
      totalDownTimeSec: 0,
      totalUpTimeSec: 0,
      versionNumber: '',
    },
  ],
  filteredValidatorsLength: 0,
  shownValidatorsLength: 0,
  validatorsAndObserversLength: 0,
};

const Validators = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { nodeUrl },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    if (ref.current !== null) {
      getValidatorsData({ nodeUrl, timeout }).then(({ data, success }) => {
        const newState = populateValidatorsTable(data);
        ref.current !== null && setState(newState);
      });
    }
  }, [nodeUrl, timeout]);

  return (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Validators</h4>
          </div>
        </div>
        <ShardsList shardData={state.shardData} />
        <ValidatorsTable filteredValidators={state.filteredValidators} />
      </div>
    </div>
  );
};

export default Validators;
