import * as React from 'react';

import { sizeFormat, urlBuilder } from 'helpers';
import { BlockType } from 'helpers/types';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  BlockGasUsed,
  IdentityBlock,
} from 'sharedComponents';

const BlocksTable = ({
  blocks,
  shard,
  showProposerIdentity,
}: {
  blocks: BlockType[];
  shard: number | undefined;
  showProposerIdentity?: boolean;
}) => {
  return (
    <div className="blocks-table table-wrapper animated-list">
      <table className="table">
        <thead>
          <tr>
            <th>Block</th>
            <th>Age</th>
            <th>Txns</th>
            <th>Shard</th>
            <th className="text-right">Size</th>
            <th className="text-right">Gas Used</th>
            <th className={showProposerIdentity ? '' : 'text-right'}>Block Hash</th>
            {showProposerIdentity && <th>Leader</th>}
          </tr>
        </thead>
        <tbody data-testid="blocksTable">
          {blocks.map((block, i) => (
            <tr key={block.hash} className={`animated-row ${block.isNew ? 'new' : ''}`}>
              <td>
                <div className="d-flex">
                  <NetworkLink to={`/blocks/${block.hash}`} data-testid={`blockLink${i}`}>
                    {block.nonce}
                  </NetworkLink>
                </div>
              </td>
              <td>
                <TimeAgo value={block.timestamp} tooltip />
              </td>
              <td>{block.txCount}</td>
              <td>
                <div className="d-flex">
                  {shard !== undefined ? (
                    <ShardSpan shard={block.shard} />
                  ) : (
                    <NetworkLink
                      to={urlBuilder.shard(block.shard)}
                      data-testid={`blockShardLink${i}`}
                    >
                      <ShardSpan shard={block.shard} />
                    </NetworkLink>
                  )}
                </div>
              </td>
              <td className="text-right">
                {block.sizeTxs !== undefined
                  ? sizeFormat(block.size + block.sizeTxs)
                  : sizeFormat(block.size)}
              </td>

              <td>
                <div className="d-flex justify-content-end pb-1" style={{ marginTop: '9px' }}>
                  <div className="d-flex flex-column align-items-end">
                    <BlockGasUsed block={block} />
                  </div>
                </div>
              </td>
              <td>
                <div className={showProposerIdentity ? '' : 'd-flex justify-content-end mr-spacer'}>
                  <NetworkLink
                    to={`/blocks/${block.hash}`}
                    data-testid={`blockHashLink${i}`}
                    className="trim-wrapper trim-size-xl mr-xl-n5"
                  >
                    <Trim text={block.hash} />
                  </NetworkLink>
                </div>
              </td>
              {showProposerIdentity && (
                <td className="identity-block">
                  <IdentityBlock block={block} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
