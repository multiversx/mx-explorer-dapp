import * as React from 'react';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, TestnetLink, TimeAgo, TrimHash, DetailItem } from 'sharedComponents';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';
import { validatorsRoutes } from 'routes';
import { metaChainShardId } from 'appConfig';

export interface BlockDataType {
  block: BlockType;
  proposer: string;
  consensusItems: string[];
  nextHash: string;
  blockFetched: boolean;
}

function decodeHex(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const BlockData = (props: BlockDataType) => {
  const { block, proposer, consensusItems, nextHash } = props;
  const isFirstBlock = block.prevHash && block.prevHash.length > 64;

  return (
    <div className="card card-small fixed-width-sm">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Block Height">
            <div className="d-flex justify-content-between">
              <div>{block.nonce}</div>
              <ul className="list-inline mb-0">
                <li className="list-inline-item ml-2 mr-2">
                  <div className="pager">
                    <TestnetLink to={`/blocks/${block.prevHash}`} data-testid="previousPageButton">
                      <FontAwesomeIcon icon={faChevronLeft} /> Prev
                    </TestnetLink>
                  </div>
                </li>
                <li className="ml-2 list-inline-item">
                  <div className="pager">
                    {nextHash !== '' ? (
                      <TestnetLink data-testid="nextPageButton" to={`/blocks/${nextHash}`}>
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </TestnetLink>
                    ) : (
                      <span className="text-muted">
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </DetailItem>

          <DetailItem title="Epoch">{block.epoch}</DetailItem>

          <DetailItem title="Timestamp">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-muted" />
            <TimeAgo value={block.timestamp} />
            &nbsp;({dateFormatted(block.timestamp)})
          </DetailItem>

          <div className="row py-3 border-bottom">
            <div className="col-lg-2 text-secondary text-lg-right">Transactions</div>
            <div className="col">{block.txCount + ' transactions in this block'}</div>
          </div>

          <div className="row py-3 border-bottom">
            <div className="col-lg-2 text-secondary text-lg-right">Shard</div>
            <div className="col">
              <TestnetLink to={urlBuilder.shard(block.shardId)}>
                <ShardSpan shardId={block.shardId} />
              </TestnetLink>
            </div>
          </div>

          <div className="row py-3 border-bottom">
            <div className="col-lg-2 text-secondary text-lg-right">Size</div>
            <div className="col">
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props: any) => (
                  <Tooltip id="size" {...props} show={props.show.toString()}>
                    {sizeFormat(block.size)} (size)
                    {block.sizeTxs !== undefined && <> + {sizeFormat(block.sizeTxs)} (sizetxs)</>}
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
            <div className="col-lg-2 text-secondary text-lg-right">Proposer</div>
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
            <div className="col-lg-2 text-secondary text-lg-right">Consensus Group</div>
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
            <div className="col-lg-2 text-secondary text-lg-right">Block Hash</div>
            <div className="col">{block.hash}</div>
          </div>

          <div className="row py-3 border-bottom">
            <div className="col-lg-2 text-secondary text-lg-right">State Root Hash</div>
            <div className="col">{block.stateRootHash}</div>
          </div>
          {block.shardId === metaChainShardId && (
            <>
              <div className="row py-3 border-bottom">
                <div className="col-lg-2 text-secondary text-lg-right">Notarized Blocks</div>
                <div className="col">
                  {block.notarizedBlocksHashes === null ||
                  (Array.isArray(block.notarizedBlocksHashes) &&
                    block.notarizedBlocksHashes.length === 0) ? (
                    <span className="text-muted">N/A</span>
                  ) : (
                    <>
                      {block.notarizedBlocksHashes.map((item, i) => (
                        <TestnetLink className="hash" key={item + i} to={`/blocks/${item}`}>
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
            <div className="col-lg-2 text-secondary text-lg-right">Miniblocks</div>
            <div className="col">
              {block.miniBlocksHashes === null ||
              (Array.isArray(block.miniBlocksHashes) && block.miniBlocksHashes.length === 0) ? (
                <span className="text-muted">N/A</span>
              ) : (
                <>
                  {block.miniBlocksHashes.map((item) => (
                    <TestnetLink className="hash" key={item} to={`/miniblocks/${item}`}>
                      <TrimHash text={item} />
                    </TestnetLink>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="row py-3 border-bottom">
            <div className="col-lg-2 text-secondary text-lg-right">Previous Hash</div>
            <div className="col">
              {isFirstBlock ? (
                <span className="text-muted">N/A</span>
              ) : (
                <TestnetLink className="hash" to={`/blocks/${block.prevHash}`}>
                  <TrimHash text={block.prevHash} />
                </TestnetLink>
              )}
            </div>
          </div>

          <div className={`row py-3 ${isFirstBlock ? 'border-bottom' : ''}`}>
            <div className="col-lg-2 text-secondary text-lg-right">Public Keys Bitmap</div>
            <div className="col">{block.pubKeyBitmap}</div>
          </div>
          {isFirstBlock && (
            <>
              <div className="row py-3">
                <div className="col">
                  <pre className="genesis px-3 pt-2 pb-4 m-0 rounded border">
                    {decodeHex(block.prevHash)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockData;
