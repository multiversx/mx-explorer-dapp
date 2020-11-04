import * as React from 'react';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim, DetailItem } from 'sharedComponents';
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

function createHashItemIfLengthIsOdd(length: number) {
  return length > 1 && length % 2 ? <div className="hash-item">&nbsp;</div> : null;
}

const BlockData = (props: BlockDataType) => {
  const { block, proposer, consensusItems, nextHash } = props;
  const isFirstBlock = block.prevHash && block.prevHash.length > 64;

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Block Height">
            <div className="d-flex justify-content-between">
              <div>{block.nonce}</div>
              <ul className="list-inline mb-0">
                <li className="list-inline-item ml-2 mr-2">
                  <div className="pager">
                    <NetworkLink to={`/blocks/${block.prevHash}`} data-testid="previousPageButton">
                      <FontAwesomeIcon icon={faChevronLeft} /> Prev
                    </NetworkLink>
                  </div>
                </li>
                <li className="ml-2 list-inline-item">
                  <div className="pager">
                    {nextHash !== '' ? (
                      <NetworkLink data-testid="nextPageButton" to={`/blocks/${nextHash}`}>
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </NetworkLink>
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

          <DetailItem title="Block Hash">
            <Trim text={block.hash} />
          </DetailItem>

          <DetailItem title="Epoch">{block.epoch}</DetailItem>

          <DetailItem title="Timestamp">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-muted" />
            <TimeAgo value={block.timestamp} />
            &nbsp;({dateFormatted(block.timestamp)})
          </DetailItem>

          <DetailItem title="Transactions">
            {block.txCount + ' transactions in this block'}
          </DetailItem>

          <DetailItem title="Shard">
            <NetworkLink to={urlBuilder.shard(block.shardId)}>
              <ShardSpan shardId={block.shardId} />
            </NetworkLink>
          </DetailItem>

          <DetailItem title="Size">
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
          </DetailItem>

          <DetailItem title="Proposer">
            {proposer === '' ? (
              <span className="text-muted">N/A</span>
            ) : (
              <NetworkLink to={`${validatorsRoutes.nodes}/${proposer}`} className="trim-wrapper">
                <Trim text={proposer} />
              </NetworkLink>
            )}
          </DetailItem>

          <DetailItem title="Consensus Group" className="hash-group-row">
            {consensusItems.length === 0 ? (
              <span className="text-muted">N/A</span>
            ) : (
              <div className="hash-group">
                {consensusItems.map((item, i) => (
                  <NetworkLink
                    className="trim-wrapper hash-item"
                    key={`${item}/${i}`}
                    to={`${validatorsRoutes.nodes}/${item}`}
                  >
                    <Trim text={item} />
                  </NetworkLink>
                ))}
                {createHashItemIfLengthIsOdd(consensusItems.length)}
              </div>
            )}
          </DetailItem>

          <DetailItem title="State Root Hash">
            <Trim text={block.stateRootHash} />
          </DetailItem>

          {block.shardId === metaChainShardId && (
            <DetailItem title="Notarized Blocks" className="hash-group-row">
              {block.notarizedBlocksHashes === null ||
              (Array.isArray(block.notarizedBlocksHashes) &&
                block.notarizedBlocksHashes.length === 0) ? (
                <span className="text-muted">N/A</span>
              ) : (
                <div className="hash-group">
                  {block.notarizedBlocksHashes.map((item, i) => (
                    <NetworkLink
                      className="trim-wrapper hash-item"
                      key={item + i}
                      to={`/blocks/${item}`}
                    >
                      <Trim text={item} />
                    </NetworkLink>
                  ))}
                  {createHashItemIfLengthIsOdd(block.notarizedBlocksHashes.length)}
                </div>
              )}
            </DetailItem>
          )}

          <DetailItem title="Miniblocks" className="hash-group-row">
            {block.miniBlocksHashes === null ||
            (Array.isArray(block.miniBlocksHashes) && block.miniBlocksHashes.length === 0) ? (
              <span className="text-muted">N/A</span>
            ) : (
              <div className="hash-group">
                {block.miniBlocksHashes.map((item) => (
                  <NetworkLink
                    className="trim-wrapper hash-item"
                    key={item}
                    to={`/miniblocks/${item}`}
                  >
                    <Trim text={item} />
                  </NetworkLink>
                ))}
                {createHashItemIfLengthIsOdd(block.miniBlocksHashes.length)}
              </div>
            )}
          </DetailItem>

          <DetailItem title="Previous Hash">
            {isFirstBlock ? (
              <span className="text-muted">N/A</span>
            ) : (
              <NetworkLink className="trim-wrapper" to={`/blocks/${block.prevHash}`}>
                <Trim text={block.prevHash} />
              </NetworkLink>
            )}
          </DetailItem>

          <DetailItem title="Public Keys Bitmap">
            <Trim text={block.pubKeyBitmap} />
          </DetailItem>

          {isFirstBlock && (
            <>
              <DetailItem title="">
                <pre className="genesis px-3 pt-2 pb-4 m-0 rounded border">
                  {decodeHex(block.prevHash)}
                </pre>
              </DetailItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockData;
