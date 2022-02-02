import * as React from 'react';
import BigNumber from 'bignumber.js';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim, DetailItem, CopyButton } from 'sharedComponents';
import { validatorsRoutes } from 'routes';
import { metaChainShardId } from 'appConfig';
import { BlockType } from 'sharedComponents/BlocksTable';

export interface BlockDataType {
  block: BlockType;
  nextHash: string;
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
  const { block, nextHash } = props;
  const isFirstBlock = block.prevHash && block.prevHash.length > 64;
  const [expanded, setExpanded] = React.useState(false);

  const toggleCollapseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(true);
  };

  const gasUsedBn = new BigNumber(block.gasConsumed)
    .minus(block.gasRefunded)
    .minus(block.gasPenalized);

  // Fixes Trim re-render bug
  React.useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }, [expanded]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 data-testid="title">Block Details</h6>
        </div>
      </div>

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
                      <span className="text-secondary">
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </DetailItem>
          <DetailItem title="Block Hash">
            <div className="d-flex align-items-center text-break-all">
              {block.hash}
              <CopyButton text={block.hash} />
            </div>
          </DetailItem>
          <DetailItem title="Epoch">{block.epoch}</DetailItem>
          <DetailItem title="Age">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
            <TimeAgo value={block.timestamp} />
            &nbsp;
            <span className="text-secondary">({dateFormatted(block.timestamp, false, true)})</span>
          </DetailItem>
          <DetailItem title="Transactions">
            {block.txCount + ' transactions in this block'}
          </DetailItem>
          <DetailItem title="Shard">
            <div className="d-flex">
              <NetworkLink to={urlBuilder.shard(block.shard)}>
                <ShardSpan shard={block.shard} />
              </NetworkLink>
            </div>
          </DetailItem>
          <DetailItem title="Size">
            <OverlayTrigger
              placement="top"
              delay={{ show: 0, hide: 400 }}
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
          <DetailItem title="Gas Used">
            {gasUsedBn.isGreaterThan(0) && new BigNumber(block.maxGasLimit).isGreaterThan(0) ? (
              <>
                {gasUsedBn.toFormat()}{' '}
                <span className="text-secondary">
                  ({gasUsedBn.dividedBy(block.maxGasLimit).times(100).toFormat(2)}
                  %)
                </span>
              </>
            ) : null}
          </DetailItem>
          <DetailItem title="Gas Provided">
            {new BigNumber(block.gasConsumed).toFormat()}{' '}
          </DetailItem>
          <DetailItem title="Gas Refunded">
            {new BigNumber(block.gasRefunded).toFormat()}
          </DetailItem>
          <DetailItem title="Gas Penalized">
            {new BigNumber(block.gasPenalized).toFormat()}
          </DetailItem>
          <DetailItem title="Max Gas Limit">
            {new BigNumber(block.maxGasLimit).toFormat()}
          </DetailItem>
          <DetailItem title="Proposer">
            <NetworkLink
              to={`${validatorsRoutes.nodes}/${block.proposer}`}
              className="trim-wrapper"
            >
              {block.proposer ? (
                <Trim text={block.proposer} />
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </NetworkLink>
          </DetailItem>
          <DetailItem title="Consensus Group" className="hash-group-row">
            <>
              {expanded === false && (
                <div className="d-flex text-break-all">
                  <a href="/#" onClick={toggleCollapseClick}>
                    {block.validators.length} validators (See all)
                  </a>
                </div>
              )}
              <Collapse in={expanded}>
                <div>
                  <div className="hash-group">
                    {block.validators.map((item, i) => (
                      <div className="hash-item mb-1" key={`${item}/${i}`}>
                        <NetworkLink
                          className="trim-wrapper"
                          to={`${validatorsRoutes.nodes}/${item}`}
                        >
                          <Trim text={item} />
                        </NetworkLink>
                      </div>
                    ))}
                    {createHashItemIfLengthIsOdd(block.validators.length)}
                  </div>
                </div>
              </Collapse>
            </>
          </DetailItem>
          <DetailItem title="State Root Hash">
            {block.stateRootHash ? (
              <Trim text={block.stateRootHash} />
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>
          {block.shard === metaChainShardId && (
            <DetailItem title="Notarized Blocks" className="hash-group-row">
              {block.notarizedBlocksHashes === undefined ||
              (Array.isArray(block.notarizedBlocksHashes) &&
                block.notarizedBlocksHashes.length === 0) ? (
                <span className="text-secondary na-item">N/A</span>
              ) : (
                <div className="hash-group">
                  {block.notarizedBlocksHashes.map((item, i) => (
                    <div className="hash-item">
                      <NetworkLink className="trim-wrapper" key={item + i} to={`/blocks/${item}`}>
                        <Trim text={item} />
                      </NetworkLink>
                    </div>
                  ))}
                  {createHashItemIfLengthIsOdd(block.notarizedBlocksHashes.length)}
                </div>
              )}
            </DetailItem>
          )}
          <DetailItem title="Miniblocks" className="hash-group-row">
            {block.miniBlocksHashes === undefined ||
            (Array.isArray(block.miniBlocksHashes) && block.miniBlocksHashes.length === 0) ? (
              <span className="text-secondary na-item">N/A</span>
            ) : (
              <div className="hash-group">
                {block.miniBlocksHashes.map((item) => (
                  <div className="hash-item" key={item}>
                    <NetworkLink className="trim-wrapper" to={`/miniblocks/${item}`}>
                      <Trim text={item} />
                    </NetworkLink>
                  </div>
                ))}
                {createHashItemIfLengthIsOdd(block.miniBlocksHashes.length)}
              </div>
            )}
          </DetailItem>
          <DetailItem title="Previous Hash">
            <div className="d-flex align-items-center">
              {isFirstBlock ? (
                <span className="text-secondary">N/A</span>
              ) : (
                <NetworkLink className="trim-wrapper" to={`/blocks/${block.prevHash}`}>
                  {block.prevHash ? (
                    <Trim text={block.prevHash} />
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </NetworkLink>
              )}
            </div>
          </DetailItem>
          <DetailItem title="Public Keys Bitmap">
            {block.pubKeyBitmap ? (
              <Trim text={block.pubKeyBitmap} />
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>
          {isFirstBlock && block.prevHash && (
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
