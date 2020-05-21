import { faCogs, faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { BlocksTable, Loader } from '../../sharedComponents';
import { getValidatorStatistics } from './../Validators/helpers/asyncRequests';
import { ValidatorStatisticsData } from './../Validators/helpers/validatorHelpers';
import { getValidator, searchBlocks } from './helpers/asyncRequests';
import { validatorFunctions } from 'helpers';
import NetworkMetrics, { NetworkMetricsType } from './NetworkMetrics';
import NodeInformation, { NodeInformationType } from './NodeInformation';
import Rounds from './Rounds';

export type StateType = NetworkMetricsType &
  ValidatorStatisticsData &
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
  rating: 0,
  ratingModifier: 0,
};

const ValidatorDetails = () => {
  const { hash } = useParams();

  const ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl, nodeUrl, validatorStatistics },
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
  const [rounds, setRounds] = React.useState<validatorFunctions.GetRoundsReturnType>({
    rounds: [],
    roundsFetched: true,
  });
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    if (ref.current !== null) {
      getValidator({
        elasticUrl,
        timeout: Math.max(timeout, 10000),
        publicKey: hash || '',
        metaChainShardId,
        nodeUrl,
      }).then(({ signersIndex, shardNumber, epoch, roundAtEpochStart, success, ...data }: any) => {
        if (ref.current !== null) {
          setState({ ...data, shardNumber });
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
          if (validatorStatistics) {
            getValidatorStatistics({ nodeUrl, timeout: Math.max(timeout, 10000) }).then(
              ({ statistics }: any) => {
                if (data.publicKey in statistics) {
                  const { rating } = statistics[data.publicKey];
                  setState(currentState => ({
                    rating,
                    ...currentState,
                  }));
                }
              }
            );
          }
          searchBlocks(props).then((blockdata: any) => setFetchedBlocks(blockdata));
        }
      });
    }
  }, [elasticUrl, timeout, hash, nodeUrl, metaChainShardId, validatorStatistics]); // run the operation only once since the parameter does not change

  const { publicKey, isValidator } = state;

  const networkMetricsStatisticsClass = validatorStatistics ? 'col-md-8' : 'col-md-7'; // 'col-md-9' : 'col-md-7';
  const networkMetricsClass = isValidator ? networkMetricsStatisticsClass : 'col-12';
  const roundsClass = validatorStatistics ? 'col-md-4' : 'col-md-5'; // 'col-md-3' : 'col-md-5';

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Node Information</h4>
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
                  <div className={networkMetricsClass}>
                    <NetworkMetrics {...state} />
                  </div>
                  {isValidator && (
                    <div className={roundsClass}>
                      <Rounds {...rounds} />
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
                                  Last 25 proposed blocks
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
                                <span className="h4 empty-heading">No blocks found</span>
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
