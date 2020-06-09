import { faCogs, faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import * as React from 'react';
import { useGlobalState } from 'context';
import { BlocksTable, Loader } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import { getValidator, searchBlocks } from './helpers/asyncRequests';
import { validatorFunctions } from 'helpers';
import NetworkMetrics, { NetworkMetricsType } from './NetworkMetrics';
import NodeInformation, { NodeInformationType } from './NodeInformation';
import Rounds from './Rounds';
import BrandInformation from './BrandInformation';
import Alert from './Alert';

export type StateType = NetworkMetricsType &
  // ValidatorStatisticsData &
  NodeInformationType & {
    shardId: string;
    startBlockNr: number;
    endBlockNr: number;
    signersIndex: number;
    success: boolean;
    rating: number;
    ratingModifier: number;
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
  instanceType: '0',
  startBlockNr: 0,
  endBlockNr: 0,
  signersIndex: -1,
  success: true,
  rating: 0,
  ratingModifier: 0,
};

const ValidatorDetails = () => {
  const ref = React.useRef(null);

  const { hash } = useParams();

  const {
    activeTestnet: { elasticUrl, nodeUrl },
    config: { metaChainShardId },
    timeout,
    validatorData,
  } = useGlobalState();

  let validator: ValidatorType | undefined;
  if (hash) {
    validator = validatorData.validatorsAndObservers.find(v => v.publicKey === hash);
    if (validator === undefined && validatorData.validatorsAndObservers.length > 0) {
      validator = { peerType: 'observer' } as any;
    }
  }

  const [state, setState] = React.useState(initialState);
  const [fetchedBlocks, setFetchedBlocks] = React.useState({
    blocks: [],
    startBlockNr: 0,
    endBlockNr: 0,
    blocksFetched: true,
  });
  const [rounds, setRounds] = React.useState<validatorFunctions.GetRoundsReturnType>({
    rounds: [],
    roundsFetched: true,
  });
  const [success, setSuccess] = React.useState(
    validator !== undefined && validator.peerType !== 'observer'
  );

  React.useEffect(() => {
    if (ref.current !== null && validator !== undefined && validator.peerType !== 'observer') {
      getValidator({
        currentValidator: validator,
        elasticUrl,
        timeout: Math.max(timeout, 10000),
        publicKey: validator.publicKey,
        metaChainShardId,
        nodeUrl,
      }).then(({ signersIndex, shardNumber, epoch, roundAtEpochStart, success, ...data }: any) => {
        if (ref.current !== null) {
          setState({ ...data, shardNumber, rating: validator!.rating });
          setSuccess(success);
          const props = {
            elasticUrl,
            timeout: Math.max(timeout, 10000),
            shardNumber,
            signersIndex,
            epoch,
            roundAtEpochStart,
          };
          validatorFunctions.getRounds(props).then(({ rounds, roundsFetched }) => {
            setRounds({ rounds, roundsFetched });
          });

          searchBlocks(props).then((blockdata: any) => setFetchedBlocks(blockdata));
        }
      });
    }
  }, [elasticUrl, timeout, nodeUrl, metaChainShardId, validator]); // run the operation only once since the parameter does not change

  const { publicKey, isValidator } = state;

  const networkMetricsClass = isValidator ? 'col-md-8' : 'col-12';

  const nodeClass = 'col-md-8';
  const brandClass = 'col-md-4';

  const isWaiting = state.instanceType.includes('waiting');

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className={success ? nodeClass : 'col-12'}>
            <h4 data-testid="title">Node Information</h4>
          </div>
          {publicKey !== '' && (
            <div className={brandClass}>
              <h4 className="d-sm-none d-lg-block">&nbsp;</h4>
            </div>
          )}
        </div>
        {validator !== undefined && <Alert validator={validator} />}
        {success ? (
          <>
            {publicKey !== '' ? (
              <>
                <div className="row">
                  <div className={nodeClass}>
                    <NodeInformation {...state} validator={validator} />
                  </div>
                  <div className={brandClass}>
                    <BrandInformation publicKey={state.publicKey} />
                  </div>
                </div>
                <div className="row">
                  <div className={networkMetricsClass}>
                    <NetworkMetrics {...state} />
                  </div>
                  {isValidator && (
                    <div className="col-md-4">
                      <Rounds {...rounds} isWaiting={isWaiting} />
                    </div>
                  )}
                </div>
                {isValidator && (
                  <>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <h4>Proposed Blocks in Current Epoch</h4>
                      </div>
                    </div>
                    {fetchedBlocks.blocksFetched ? (
                      <>
                        {fetchedBlocks.blocks.length > 0 ? (
                          <div className="row">
                            <div className="col-12">
                              <div className="card">
                                <div className="card-body">
                                  Last {fetchedBlocks.blocks.length} proposed blocks
                                  <BlocksTable
                                    blocks={fetchedBlocks.blocks}
                                    shardId={undefined}
                                    epochId={undefined}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Loader />
                        )}
                      </>
                    ) : (
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body card-details" data-testid="errorScreen">
                              <div className="empty">
                                <FontAwesomeIcon icon={faCube} className="empty-icon" />
                                <span className="h4 empty-heading">
                                  {isWaiting ? 'Validator not in consensus' : 'No blocks found'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                <span className="h4 empty-heading">Unable to locate this node</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorDetails;
