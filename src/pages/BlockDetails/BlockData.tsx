import * as React from 'react';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { METACHAIN_SHARD_ID } from 'appConstants';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  DetailItem,
  CopyButton,
  IdentityBlock,
  BlockGasUsed
} from 'components';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { BlockType } from 'types';

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
  return length > 1 && length % 2 ? (
    <div className='hash-item'>&nbsp;</div>
  ) : null;
}

export const BlockData = (props: BlockDataType) => {
  const { block, nextHash } = props;
  const isFirstBlock = block.prevHash && block.prevHash.length > 64;
  const [expanded, setExpanded] = React.useState(false);

  const toggleCollapseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(true);
  };

  // Fixes Trim re-render bug
  React.useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }, [expanded]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item d-flex align-items-center'>
          <h6 data-testid='title'>Block Details</h6>
        </div>
      </div>

      <div className='card-body'>
        <div className='container-fluid'>
          <DetailItem title='Block Height'>
            <div className='d-flex justify-content-between align-items-center'>
              <div>{block.nonce}</div>
              <ul className='list-inline mb-0'>
                <li className='list-inline-item ms-2 me-2'>
                  <div className='pager pager-inline'>
                    <NetworkLink
                      to={`/blocks/${block.prevHash}`}
                      data-testid='previousPageButton'
                    >
                      <FontAwesomeIcon icon={faChevronLeft} /> Prev
                    </NetworkLink>
                  </div>
                </li>
                <li className='ms-2 list-inline-item'>
                  <div className='pager pager-inline'>
                    {nextHash !== '' ? (
                      <NetworkLink
                        data-testid='nextPageButton'
                        to={`/blocks/${nextHash}`}
                      >
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </NetworkLink>
                    ) : (
                      <span className='text-neutral-400'>
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </DetailItem>
          <DetailItem title='Block Hash'>
            <div className='d-flex align-items-center text-break-all'>
              {block.hash}
              <CopyButton text={block.hash} />
            </div>
          </DetailItem>

          <DetailItem title='Round'>{block.round}</DetailItem>
          <DetailItem title='Epoch'>{block.epoch}</DetailItem>

          <DetailItem title='Age'>
            <FontAwesomeIcon icon={faClock} className='me-2 text-neutral-400' />
            <TimeAgo value={block.timestamp} />
            &nbsp;
            <span className='text-neutral-400'>
              ({dateFormatted(block.timestamp, false, true)})
            </span>
          </DetailItem>
          <DetailItem title='Transactions'>
            {block.txCount + ' transactions in this block'}
          </DetailItem>
          <DetailItem title='Shard'>
            <div className='d-flex'>
              <NetworkLink to={urlBuilder.shard(block.shard)}>
                <ShardSpan shard={block.shard} />
              </NetworkLink>
            </div>
          </DetailItem>
          <DetailItem title='Size'>
            <OverlayTrigger
              placement='top'
              delay={{ show: 0, hide: 400 }}
              overlay={(props: any) => (
                <Tooltip id='size' {...props} show={props.show.toString()}>
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
          </DetailItem>
          <DetailItem title='Gas Used'>
            <div className='d-flex flex-column align-items-start'>
              <BlockGasUsed block={block} />
            </div>
          </DetailItem>
          <DetailItem title='Gas Provided'>
            {new BigNumber(block.gasConsumed).toFormat()}{' '}
          </DetailItem>
          <DetailItem title='Gas Refunded'>
            {new BigNumber(block.gasRefunded).toFormat()}
          </DetailItem>
          <DetailItem title='Gas Penalized'>
            {new BigNumber(block.gasPenalized).toFormat()}
          </DetailItem>
          <DetailItem title='Max Gas Limit'>
            {new BigNumber(block.maxGasLimit).toFormat()}
          </DetailItem>
          <DetailItem title='Proposer'>
            {block.proposer ? (
              <IdentityBlock block={block} />
            ) : (
              <span className='text-neutral-400'>N/A</span>
            )}
          </DetailItem>

          <DetailItem title='Consensus Group' className='hash-group-row'>
            {block.validators ? (
              <>
                {expanded === false && (
                  <div className='d-flex text-break-all'>
                    <a href='/#' onClick={toggleCollapseClick}>
                      {block.validators.length} validators (See all)
                    </a>
                  </div>
                )}
                <Collapse in={expanded}>
                  <div>
                    <div className='hash-group'>
                      {block.validators.map((item, i) => (
                        <div className='hash-item mb-1' key={`${item}/${i}`}>
                          <NetworkLink
                            className='trim-wrapper'
                            to={urlBuilder.nodeDetails(item)}
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
            ) : (
              <span className='text-neutral-400'>N/A</span>
            )}
          </DetailItem>
          <DetailItem title='State Root Hash'>
            {block.stateRootHash ? (
              <Trim text={block.stateRootHash} />
            ) : (
              <span className='text-neutral-400'>N/A</span>
            )}
          </DetailItem>
          {block.shard === METACHAIN_SHARD_ID && (
            <DetailItem title='Notarized Blocks' className='hash-group-row'>
              {block.notarizedBlocksHashes === undefined ||
              (Array.isArray(block.notarizedBlocksHashes) &&
                block.notarizedBlocksHashes.length === 0) ? (
                <span className='text-neutral-400 na-item'>N/A</span>
              ) : (
                <div className='hash-group'>
                  {block.notarizedBlocksHashes.map((item, i) => (
                    <div className='hash-item' key={item + i}>
                      <NetworkLink
                        className='trim-wrapper'
                        to={`/blocks/${item}`}
                      >
                        <Trim text={item} />
                      </NetworkLink>
                    </div>
                  ))}
                  {createHashItemIfLengthIsOdd(
                    block.notarizedBlocksHashes.length
                  )}
                </div>
              )}
            </DetailItem>
          )}
          <DetailItem title='Miniblocks' className='hash-group-row'>
            {block.miniBlocksHashes === undefined ||
            (Array.isArray(block.miniBlocksHashes) &&
              block.miniBlocksHashes.length === 0) ? (
              <span className='text-neutral-400 na-item'>N/A</span>
            ) : (
              <div className='hash-group'>
                {block.miniBlocksHashes.map((item) => (
                  <div className='hash-item' key={item}>
                    <NetworkLink
                      className='trim-wrapper'
                      to={`/miniblocks/${item}`}
                    >
                      <Trim text={item} />
                    </NetworkLink>
                  </div>
                ))}
                {createHashItemIfLengthIsOdd(block.miniBlocksHashes.length)}
              </div>
            )}
          </DetailItem>
          <DetailItem title='Previous Hash'>
            <div className='d-flex align-items-center'>
              {isFirstBlock ? (
                <span className='text-neutral-400'>N/A</span>
              ) : block.prevHash ? (
                <NetworkLink
                  className='trim-wrapper'
                  to={`/blocks/${block.prevHash}`}
                >
                  <Trim text={block.prevHash} />
                </NetworkLink>
              ) : (
                <span className='text-neutral-400'>N/A</span>
              )}
            </div>
          </DetailItem>
          <DetailItem title='Public Keys Bitmap'>
            {block.pubKeyBitmap ? (
              <Trim text={block.pubKeyBitmap} />
            ) : (
              <span className='text-neutral-400'>N/A</span>
            )}
          </DetailItem>
          {isFirstBlock && block.prevHash && (
            <>
              <DetailItem title=''>
                <pre className='genesis px-3 pt-2 pb-4 m-0 rounded border'>
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
