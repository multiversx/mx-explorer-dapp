import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { isHash, dateFormatted, sizeFormat, networkRoute, urlBuilder } from 'helpers';
import {
  Loader,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  adapter,
  TrimHash,
  PageState,
} from 'sharedComponents';
import { initialState, BlockType } from 'sharedComponents/Adapter/functions/getBlock';
import { validatorsRoutes } from 'routes';
import { metaChainShardId } from 'appConfig';

function decodeHex(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export interface StateType {
  block: BlockType;
  proposer: string;
  consensusItems: string[];
  nextHash: string;
  blockFetched: boolean;
}

const BlockDetails: React.FC = () => {
  const params: any = useParams();

  const { hash: blockId } = params;
  const history = useHistory();

  const ref = React.useRef(null);

  const { activeNetworkId } = useGlobalState();

  const { getBlock } = adapter();

  const [state, setState] = React.useState<StateType>(initialState);

  if (blockId && !isHash(blockId)) {
    history.push(networkRoute({ to: `/not-found`, activeNetworkId }));
  }

  const fetchBlock = () => {
    if (blockId) {
      getBlock({ blockId }).then((data) => ref.current !== null && setState(data));
    }
  };

  React.useEffect(fetchBlock, [blockId]); // run the operation only once since the parameter does not change

  const { block, proposer, consensusItems, nextHash, blockFetched } = state;

  const isFirsBlock = block.prevHash && block.prevHash.length > 64;

  return (
    <div className="block-details" ref={ref}>
      <div className="container py-spacer">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-spacer" data-testid="title">
              Block Details
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!blockFetched ? (
              <div className="card">
                <div className="card-body card-small">
                  <PageState
                    icon={faCube}
                    title={'Unable to locate this block hash'}
                    description={blockId}
                    className="py-spacer d-flex h-100 align-items-center justify-content-center"
                    dataTestId="errorScreen"
                  />
                </div>
              </div>
            ) : (
              <>
                {block.hash ? (
                  <div className="card card-small fixed-width-sm">
                    <div className="card-body p-0">
                      <div className="container-fluid">
                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Block Height</div>
                          <div className="col">
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
                                {nextHash !== '' && (
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
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Epoch</div>
                          <div className="col">{block.epoch}</div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Timestamp</div>
                          <div className="col">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            <TimeAgo value={block.timestamp} />
                            &nbsp;({dateFormatted(block.timestamp)})
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Transactions</div>
                          <div className="col">{block.txCount + ' transactions in this block'}</div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Shard</div>
                          <div className="col">
                            <TestnetLink to={urlBuilder.shard(block.shardId)}>
                              <ShardSpan shardId={block.shardId} />
                            </TestnetLink>
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Size</div>
                          <div className="col">
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

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Proposer</div>
                          <div className="col">
                            {proposer === '' ? (
                              <span className="text-muted">N/A</span>
                            ) : (
                              <TestnetLink to={`${validatorsRoutes.nodes}/${proposer}`}>
                                <TrimHash text={proposer} />
                              </TestnetLink>
                            )}
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Consensus Group</div>
                          <div className="col">
                            {consensusItems.length === 0 ? (
                              <span className="text-muted">N/A</span>
                            ) : (
                              <>
                                {consensusItems.map((item, i) => (
                                  <TestnetLink
                                    className="hash"
                                    key={`${item}/${i}`}
                                    to={`${validatorsRoutes.nodes}/${item}`}
                                  >
                                    <TrimHash text={item} />
                                  </TestnetLink>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Block Hash</div>
                          <div className="col">{block.hash}</div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">State Root Hash</div>
                          <div className="col">{block.stateRootHash}</div>
                        </div>
                        {block.shardId === metaChainShardId && (
                          <>
                            <div className="row py-3 border-bottom">
                              <div className="col-lg-2 text-light text-lg-right">
                                Notarized Blocks
                              </div>
                              <div className="col">
                                {block.notarizedBlocksHashes === null ||
                                (Array.isArray(block.notarizedBlocksHashes) &&
                                  block.notarizedBlocksHashes.length === 0) ? (
                                  <span className="text-muted">N/A</span>
                                ) : (
                                  <>
                                    {block.notarizedBlocksHashes.map((item, i) => (
                                      <TestnetLink
                                        className="hash"
                                        key={item + i}
                                        to={`/blocks/${item}`}
                                      >
                                        <TrimHash text={item} />
                                      </TestnetLink>
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Miniblocks</div>
                          <div className="col">
                            {block.miniBlocksHashes === null ||
                            (Array.isArray(block.miniBlocksHashes) &&
                              block.miniBlocksHashes.length === 0) ? (
                              <span className="text-muted">N/A</span>
                            ) : (
                              <>
                                {block.miniBlocksHashes.map((item) => (
                                  <TestnetLink
                                    className="hash"
                                    key={item}
                                    to={`/miniblocks/${item}`}
                                  >
                                    <TrimHash text={item} />
                                  </TestnetLink>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">Previous Hash</div>
                          <div className="col">
                            {isFirsBlock ? (
                              <span className="text-muted">N/A</span>
                            ) : (
                              <TestnetLink className="hash" to={`/blocks/${block.prevHash}`}>
                                <TrimHash text={block.prevHash} />
                              </TestnetLink>
                            )}
                          </div>
                        </div>

                        <div className="row py-3 border-bottom">
                          <div className="col-lg-2 text-light text-lg-right">
                            Public Keys Bitmap
                          </div>
                          <div className="col">{block.pubKeyBitmap}</div>
                        </div>
                        {isFirsBlock && (
                          <>
                            <div className="row py-3 border-bottom">
                              <div className="col-lg-12">
                                <pre className="genesis rounded border px-3 pt-2 pb-4">
                                  {decodeHex(block.prevHash)}
                                </pre>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Loader dataTestId="loader" />
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
