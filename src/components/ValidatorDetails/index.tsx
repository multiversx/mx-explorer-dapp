import * as React from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { BlocksTable } from '../../sharedComponents';
import { useGlobalState } from '../../context';
import { getValidator, getRounds, searchBlocks } from './helpers/asyncRequests';
import NetworkMetrics, { NetworkMetricsType } from './NetworkMetrics';
import NodeInformation, { NodeInformationType } from './NodeInformation';
import Rounds from './Rounds';

export type StateType = NetworkMetricsType &
  NodeInformationType & {
    shardId: string;
    startBlockNr: number;
    endBlockNr: number;
    signersIndex: number;
    success: boolean;
  };

export const initialState: StateType = {
  shardId: '0',
  publicKey: '',
  shardNumber: 0,
  versionNumber: '0',
  isActive: false,
  nodeDisplayName: '0',
  isValidator: false,
  publicKeyBlockSign: '0',
  totalDownTimePercentege: 0,
  totalUpTimePercentege: 0,
  totalUpTimeLabel: '',
  totalDownTimeLabel: '',
  instanceType: 0,
  startBlockNr: 0,
  endBlockNr: 0,
  signersIndex: -1,
  success: true,
};

const ValidatorDetails = () => {
  let { hash: hexPublicKey } = useParams();

  let ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl, nodeUrl },
    config: { metaChainShardId },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState(initialState);
  const [fetchedBlocks, setFetchedBlocks] = React.useState({
    blocks: [],
    startBlockNr: 0,
    endBlockNr: 0,
    blocksFetched: true,
  });
  const [rounds, setRounds] = React.useState([]);
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    if (ref.current !== null) {
      getValidator({
        elasticUrl,
        timeout: Math.max(timeout, 6000),
        hexPublicKey: hexPublicKey || '',
        metaChainShardId,
        nodeUrl,
      }).then(({ signersIndex, shardNumber, success, ...data }: any) => {
        if (ref.current !== null) {
          setState(data);
          setSuccess(success);
          const props = { elasticUrl, timeout, shardNumber, signersIndex };
          getRounds(props).then(({ rounds }) => setRounds(rounds));
          searchBlocks(props).then((blockdata: any) => setFetchedBlocks(blockdata));
        }
      });
    }
  }, [elasticUrl, timeout, hexPublicKey, nodeUrl, metaChainShardId]); // run the operation only once since the parameter does not change

  const {
    publicKey,
    isValidator,
    // code,
  } = state;

  return (
    <div ref={ref}>
      <div className="container pt-4 pb-3">
        <div className="row mb-2">
          <div className="col-12">
            <h4>Node Information</h4>
          </div>
        </div>
        {success ? (
          <>
            {publicKey !== '' ? (
              <>
                <div className="row">
                  <div className="col-12">
                    <NodeInformation {...state} />
                  </div>
                </div>
                <div className="row">
                  <div className={isValidator ? 'col-md-7' : 'col-12'}>
                    <NetworkMetrics {...state} />
                  </div>
                  {isValidator && <Rounds rounds={rounds} />}
                </div>
                {isValidator && (
                  <>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <h4>Proposed Blocks</h4>
                      </div>
                    </div>
                    <div className="row" ng-show="isValidator">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body">
                            Last 25 proposed blocks
                            <BlocksTable blocks={fetchedBlocks.blocks} shardId={undefined} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="card">
                <div className="card-body card-details">
                  <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 text-center">
                      <div className="lds-ellipsis mx-auto mt-5 mb-5">
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
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                <span className="h4 empty-heading">Unable to load validators</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorDetails;
