import * as React from 'react';
//@ts-ignore
import kendo from 'kendo-ui-core/js/kendo.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { Highlights } from './../../sharedComponents';
import { useGlobalState } from '../../context';
import { getValidatorsData } from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import ShardsList from './ShardsList';
import ValidatorsTable, { initialState } from './ValidatorsTable';
import { statement } from '@babel/template';

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

const Validators = () => {
  var dataSource = new kendo.data.DataSource({
    data: [{ name: 'Jane Doe' }, { name: 'John Doe' }],
  });
  dataSource.filter({ field: 'name', operator: 'startswith', value: 'Jane' });
  var view = dataSource.view();
  console.log(view.length);
  console.log(view[0].name);

  let ref = React.useRef(null);
  const {
    activeTestnet: { nodeUrl },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState({ success: true, data: initialState });

  React.useEffect(() => {
    if (ref.current !== null) {
      getValidatorsData({ nodeUrl, timeout }).then(({ data, success }) => {
        const newState = populateValidatorsTable(data);
        ref.current !== null && setState({ success, data: newState });
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
        {state.success ? (
          <>
            {state.data.validatorsLength > 0 ? (
              <>
                <ShardsList shardData={state.data.shardData} />
                <ValidatorsTable {...state.data} />
              </>
            ) : (
              <div className="card">
                <div className="card-body card-details">
                  <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 text-center">
                      <div className="lds-ellipsis mx-auto">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card-body card-details" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faCogs} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load validators</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Validators;
