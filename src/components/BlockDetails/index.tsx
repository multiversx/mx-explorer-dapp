import { faChevronLeft, faChevronRight, faClock, faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { isHash, dateFormatted, sizeFormat, testnetRoute, truncate } from '../../helpers';
import { Loader, ShardSpan, TestnetLink, TimeAgo } from '../../sharedComponents';
import { BlockType } from '../Blocks';
import { getBlock } from './helpers/asyncRequests';

export interface StateType {
  block: BlockType;
  proposer: string;
  consensusItems: string[];
  nextHash: string;
  blockFetched: boolean;
}

export const initialState = {
  block: {
    hash: '',
    nonce: 0,
    epoch: 0,
    prevHash: '',
    proposer: 0,
    pubKeyBitmap: '',
    round: 0,
    shardId: 0,
    size: 0,
    sizeTxs: 0,
    stateRootHash: '',
    timestamp: 0,
    txCount: 0,
    validators: [],
    miniBlocksHashes: [],
    notarizedBlocksHashes: [],
  },
  proposer: '',
  consensusItems: [],
  nextHash: '',
  blockFetched: true,
};

const BlockDetails: React.FC = () => {
  const { hash: blockId } = useParams();
  const history = useHistory();

  const ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    activeTestnetId,
    timeout,
    config: { metaChainShardId },
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);

  if (blockId && !isHash(blockId)) {
    history.push(testnetRoute({ to: `/not-found`, activeTestnetId }));
  }

  React.useEffect(() => {
    if (blockId) {
      getBlock({ elasticUrl, blockId, timeout }).then(
        data => ref.current !== null && setState(data)
      );
    }
  }, [elasticUrl, blockId, timeout]); // run the operation only once since the parameter does not change

  const { block, proposer, consensusItems, nextHash, blockFetched } = state;

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Block Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!blockFetched ? (
              <div className="card">
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faCube} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this block hash</span>
                    <span className="empty-details">{blockId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {block.hash ? (
                  <div className="card">
                    <div className="card-body card-details">
                      <div className="row">
                        <div className="col-lg-2 card-label">Block Height</div>
                        <div className="col-lg-10">
                          <div className="d-flex justify-content-between">
                            <div>{block.nonce}</div>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item ml-2 mr-2">
                                <div className="pager">
                                  <TestnetLink
                                    to={`/blocks/${block.prevHash}`}
                                    data-testid="previousPageButton"
                                  >
                                    <FontAwesomeIcon icon={faChevronLeft} /> Prev
                                  </TestnetLink>
                                </div>
                              </li>
                              <li className="ml-2 list-inline-item">
                                <div className="pager">
                                  <TestnetLink
                                    data-testid="nextPageButton"
                                    to={`/blocks/${nextHash}`}
                                  >
                                    Next <FontAwesomeIcon icon={faChevronRight} />
                                  </TestnetLink>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Epoch</div>
                        <div className="col-lg-10">{block.epoch}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Timestamp</div>
                        <div className="col-lg-10">
                          &nbsp;
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          <TimeAgo value={block.timestamp} />
                          &nbsp;({dateFormatted(block.timestamp)})
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Transactions</div>
                        <div className="col-lg-10">
                          {block.txCount + ' transactions in this block'}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Shard</div>
                        <div className="col-lg-10">
                          <TestnetLink to={`/blocks/shards/${block.shardId}`}>
                            <ShardSpan shardId={block.shardId} />
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Size</div>
                        <div className="col-lg-10">
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(props: any) => (
                              <Tooltip id="size" {...props} show={props.show.toString()}>
                                {sizeFormat(block.size)} (size)
                                {block.sizeTxs !== undefined && (
                                  <> + {sizeFormat(block.sizeTxs)} (sizetxs)</>
                                )}
                              </Tooltip>
                            )}
                          >
                            <span>
                              {block.sizeTxs !== undefined
                                ? sizeFormat(block.size + block.sizeTxs)
                                : sizeFormat(block.size)}
                            </span>
                          </OverlayTrigger>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Proposer</div>
                        <div className="col-lg-10">
                          {proposer === '' ? (
                            <span className="text-muted">N/A</span>
                          ) : (
                            <TestnetLink to={`/validators/${proposer}`}>
                              {truncate(proposer, 100)}
                            </TestnetLink>
                          )}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Consensus group</div>
                        <div className="col-lg-10">
                          {consensusItems.length === 0 ? (
                            <span className="text-muted">N/A</span>
                          ) : (
                            <>
                              {consensusItems.map(item => (
                                <TestnetLink className="hash" key={item} to={`/validators/${item}`}>
                                  {truncate(item, 100)}
                                </TestnetLink>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Block Hash</div>
                        <div className="col-lg-10">{block.hash}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">State Root Hash</div>
                        <div className="col-lg-10">{block.stateRootHash}</div>
                      </div>
                      {block.shardId === metaChainShardId && (
                        <>
                          <hr className="hr-space" />
                          <div className="row">
                            <div className="col-lg-2 card-label">Notarized Blocks</div>
                            <div className="col-lg-10">
                              {block.notarizedBlocksHashes === null ||
                              (Array.isArray(block.notarizedBlocksHashes) &&
                                block.notarizedBlocksHashes.length === 0) ? (
                                <span className="text-muted">N/A</span>
                              ) : (
                                <>
                                  {block.notarizedBlocksHashes.map(item => (
                                    <TestnetLink className="hash" key={item} to={`/blocks/${item}`}>
                                      {truncate(item, 100)}
                                    </TestnetLink>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Miniblocks</div>
                        <div className="col-lg-10">
                          {block.miniBlocksHashes === null ||
                          (Array.isArray(block.miniBlocksHashes) &&
                            block.miniBlocksHashes.length === 0) ? (
                            <span className="text-muted">N/A</span>
                          ) : (
                            <>
                              {block.miniBlocksHashes.map(item => (
                                <TestnetLink className="hash" key={item} to={`/miniblocks/${item}`}>
                                  {truncate(item, 100)}
                                </TestnetLink>
                              ))}
                            </>
                          )}
                        </div>
                      </div>

                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Previous Hash</div>
                        <div className="col-lg-10">
                          <TestnetLink className="hash" to={`/blocks/${block.prevHash}`}>
                            {block.prevHash}
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Public Keys Bitmap</div>
                        <div className="col-lg-10">{block.pubKeyBitmap}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
