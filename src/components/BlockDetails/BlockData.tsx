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

          <DetailItem title="Transactions">
            {block.txCount + ' transactions in this block'}
          </DetailItem>

          <DetailItem title="Shard">
            <TestnetLink to={urlBuilder.shard(block.shardId)}>
              <ShardSpan shardId={block.shardId} />
            </TestnetLink>
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
              <TestnetLink to={`${validatorsRoutes.nodes}/${proposer}`}>
                <TrimHash text={proposer} />
              </TestnetLink>
            )}
          </DetailItem>

          <DetailItem title="Consensus Group">
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
          </DetailItem>

          <DetailItem title="Block Hash">{block.hash}</DetailItem>
          <DetailItem title="State Root Hash">{block.stateRootHash}</DetailItem>

          {block.shardId === metaChainShardId && (
            <DetailItem title="Notarized Blocks">
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
            </DetailItem>
          )}

          <DetailItem title="Miniblocks">
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
          </DetailItem>

          <DetailItem title="Previous Hash">
            {isFirstBlock ? (
              <span className="text-muted">N/A</span>
            ) : (
              <TestnetLink className="hash" to={`/blocks/${block.prevHash}`}>
                <TrimHash text={block.prevHash} />
              </TestnetLink>
            )}
          </DetailItem>

          <DetailItem title="Public Keys Bitmap">{block.pubKeyBitmap}</DetailItem>

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
