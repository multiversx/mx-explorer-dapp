import * as React from 'react';
import { Highlights } from './../../sharedComponents';
import { useGlobalState } from '../../context';
import { getValidatorsData } from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import ShardsList from './ShardsList';

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
  filteredValidators: [{}],
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
      </div>
    </div>
  );
};

export default Validators;
