import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getBlocks, getTotalBlocks } from './helpers/asyncRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { Highlights, TimeAgo, Pager, TestnetLink, ShardSpan } from './../../sharedComponents';
import { truncate, sizeFormat, dateFormatted } from './../../helpers';
import { useGlobalState } from '../../context';

export type BlockType = {
  hash: string;
  nonce: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: Array<number>;
};

type StateType = {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
  blocksFetched: boolean;
};

const initialState = {
  blocks: [],
  startBlockNr: 0,
  endBlockNr: 0,
  blocksFetched: true,
};

const Blocks: React.FC = () => {
  let { page, shard } = useParams();
  const shardId = parseInt(shard!) ? parseInt(shard!) : undefined;

  let ref = React.useRef(null);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const [state, setState] = React.useState<StateType>(initialState);
  const [totalBlocks, setTotalBlocks] = React.useState<number>(0);

  const {
    activeTestnet: { elasticUrl },
    timeout,
  } = useGlobalState();

  React.useEffect(() => {
    if (ref.current !== null) {
      getBlocks({ elasticUrl, size, shardId, timeout }).then(data => setState(data));
      getTotalBlocks({ elasticUrl, shardId, timeout }).then(data => setTotalBlocks(data));
    }
  }, [elasticUrl, size, shardId, timeout]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>
              {shardId && (
                <>
                  <ShardSpan shardId={shardId} />
                  &nbsp;
                </>
              )}
              Blocks
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              {!state.blocksFetched ? (
                <div className="card-body card-details" data-testid="errorScreen">
                  <div className="empty">
                    <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to load blocks</span>
                  </div>
                </div>
              ) : (
                <div className="card-body card-list">
                  <Pager slug={shardId ? `shards/${shardId}` : 'blocks'} />
                  {state.startBlockNr > 0 && `Block #${state.startBlockNr} to #${state.endBlockNr}`}
                  &nbsp;
                  {totalBlocks > 0 && `(Total of ${totalBlocks.toLocaleString('en')} blocks)`}
                  <div className="table-responsive">
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th>Block</th>
                          <th>Age</th>
                          <th>Txns</th>
                          <th>Shard</th>
                          <th>Size</th>
                          <th>Block Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.blocks.map((block, i) => (
                          <tr
                            ng-repeat="block in blocks"
                            className="animated fadeIn"
                            key={block.hash}
                          >
                            <td>
                              <TestnetLink to={`/blocks/${block.hash}`}>{block.nonce}</TestnetLink>
                            </td>
                            <td>
                              <span title={dateFormatted(block.timestamp)}>
                                <TimeAgo value={block.timestamp} />
                              </span>
                            </td>
                            <td>{block.txCount}</td>
                            <td>
                              {shardId ? (
                                <ShardSpan shardId={block.shardId} />
                              ) : (
                                <TestnetLink to={`/shards/${block.shardId}/page/1`}>
                                  <ShardSpan shardId={block.shardId} />
                                </TestnetLink>
                              )}
                            </td>
                            <td>{sizeFormat(block.size)}</td>
                            <td>
                              <TestnetLink to={`/block/${block.hash}`}>
                                {truncate(block.hash, 20)}
                              </TestnetLink>
                            </td>
                          </tr>
                        ))}
                        {state.blocks.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center pt-5 pb-4 border-0">
                              <div className="lds-ellipsis">
                                <div />
                                <div />
                                <div />
                                <div />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocks;
