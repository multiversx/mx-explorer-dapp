import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { useParams } from 'react-router-dom';
import * as React from 'react';
import { useGlobalState } from 'context';
import { BlocksTable, Loader, adapter, PageState } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import {
  GetRoundsReturnType,
  initialState,
  getHistoricRatings,
} from 'sharedComponents/Adapter/functions/getValidators';
import NetworkMetrics, { NetworkMetricsType } from './NetworkMetrics';
import NodeInformation, { NodeInformationType } from './NodeInformation';
import Rounds from './Rounds';
import RatingsChart, { HistoricRatingType } from './RatingsChart';
import BrandInformation from './BrandInformation';
import Alert from './Alert';
import useSetValidatorsData from './../useSetValidatorsData';
import { metaChainShardId, explorerApi } from 'appConfig';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';

export type StateType = NetworkMetricsType &
  NodeInformationType & {
    shardId: string;
    startBlockNr: number;
    endBlockNr: number;
    signersIndex: number;
    success: boolean;
    rating: number;
    ratingModifier: number;
    historicRatings: HistoricRatingType[];
  };

const ValidatorDetails = () => {
  const ref = React.useRef(null);
  const { hash } = useParams() as any;
  const [validator, setValidator] = React.useState<ValidatorType>();
  const [dataFetched] = React.useState(useSetValidatorsData(ref));
  const [state, setState] = React.useState(initialState);
  const [fetchedBlocks, setFetchedBlocks] = React.useState({
    blocks: [],
    startBlockNr: 0,
    endBlockNr: 0,
    blocksFetched: undefined,
  });
  const [rounds, setRounds] = React.useState<GetRoundsReturnType>({
    rounds: [],
    roundsFetched: undefined,
  });

  const { timeout, validatorData } = useGlobalState();

  const { getRounds, getValidator, searchBlocks } = adapter();

  React.useEffect(() => {
    if (hash) {
      const foundValidator = validatorData.validatorsAndObservers.find((v) => v.publicKey === hash);
      if (foundValidator === undefined && validatorData.validatorsAndObservers.length > 0) {
        setSuccess(false);
      } else {
        setValidator(foundValidator);
      }
    }
  }, [hash, validatorData, dataFetched]);

  const [success, setSuccess] = React.useState(true);

  const getData = () => {
    if (ref.current !== null && validator !== undefined && validator.peerType !== 'observer') {
      getValidator({
        currentValidator: validator,
        publicKey: validator.publicKey,
        explorerApi,
      }).then(({ signersIndex, shardNumber, epoch, roundAtEpochStart, success, ...data }: any) => {
        if (ref.current !== null) {
          setState({ ...data, shardNumber, rating: validator!.rating });
          setSuccess(success);

          getHistoricRatings({ explorerApi, timeout, publicKey: validator.publicKey }).then(
            (historicRatings: HistoricRatingType[]) => {
              setState((state: any) => ({ ...state, historicRatings }));
            }
          );

          getRounds({ shardNumber, signersIndex, epoch, roundAtEpochStart }).then(
            ({ rounds, roundsFetched }) => {
              if (ref.current !== null) {
                setRounds({ rounds, roundsFetched });
              }
            }
          );

          searchBlocks({ shardNumber, signersIndex, epoch, roundAtEpochStart }).then(
            (blockdata: any) => {
              if (ref.current !== null) {
                setFetchedBlocks(blockdata);
              }
            }
          );
        }
      });
    }
  };

  React.useEffect(getData, [metaChainShardId, validator, explorerApi]); // run the operation only once since the parameter does not change

  const { publicKey, isValidator } = state;
  const isWaiting = state.instanceType && state.instanceType.includes('waiting');

  return (
    <>
      {publicKey === '' && <Loader />}
      {success === false && (
        <PageState
          icon={faCogs}
          title="Unable to locate this node"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {success && publicKey !== '' && (
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Node Information
                </h3>
              </div>
            </div>

            {validator !== undefined && <Alert validator={validator} />}

            <div className="row">
              <div className="col-md-8 mt-spacer">
                <NodeInformation {...state} />
              </div>
              <div className="col-md-4 mt-spacer">
                <BrandInformation publicKey={state.publicKey} />
              </div>
            </div>

            <div className="row">
              <div className={`mt-spacer ${isValidator ? 'col-md-4' : 'col-8'}`}>
                <NetworkMetrics {...state} />
              </div>
              <div className="col-md-4 mt-spacer">
                <RatingsChart historicRatings={state.historicRatings} />
              </div>
              {isValidator && (
                <div className="col-md-4 mt-spacer">
                  <Rounds {...rounds} isWaiting={Boolean(isWaiting)} />
                </div>
              )}
            </div>
            {isValidator && (
              <div className="row">
                <div className="col-12 mt-spacer">
                  <div className="card card-small">
                    {fetchedBlocks.blocksFetched === undefined && <Loader />}
                    {fetchedBlocks.blocksFetched === false && <FailedBlocks />}
                    {fetchedBlocks.blocksFetched === true && fetchedBlocks.blocks.length === 0 && (
                      <NoBlocks title={isWaiting ? 'Validator not in consensus' : 'No blocks'} />
                    )}
                    {fetchedBlocks.blocksFetched === true && fetchedBlocks.blocks.length > 0 && (
                      <>
                        <div className="card-header border-0 p-0">
                          <div className="card-header-item border-bottom p-3">
                            <h6 className="m-0">
                              Last {fetchedBlocks.blocks.length} proposed Blocks in Current Epoch
                            </h6>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <BlocksTable blocks={fetchedBlocks.blocks} shardId={undefined} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ValidatorDetails;
