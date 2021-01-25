import * as React from 'react';
import { sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';

export interface BlockType {
  hash: string;
  nonce: number;
  shard: number;
  size: number;
  sizeTxs: number;
  timestamp: number;
  txCount: number;
  validators: string[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
  epoch?: number;
  prevHash?: string;
  proposer?: string;
  pubKeyBitmap?: string;
  round?: number;
  stateRootHash?: string;
  isNew?: boolean; // UI flag
}

const BlocksTable = ({ blocks, shard }: { blocks: BlockType[]; shard: number | undefined }) => {
  return (
    <div className="table-wrapper animated-list">
      <table className="table">
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
              <td>
                {block.sizeTxs !== undefined
                  ? sizeFormat(block.size + block.sizeTxs)
                  : sizeFormat(block.size)}
              </td>
              <td>
                <div className="d-flex">
                  <NetworkLink
                    to={`/blocks/${block.hash}`}
                    data-testid={`blockHashLink${i}`}
                    className="trim-wrapper"
                  >
                    <Trim text={block.hash} />
                  </NetworkLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
