import * as React from 'react';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';

export interface BlockType {
  hash: string;
  nonce: number;
  epoch: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  sizeTxs: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: number[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
}

const BlocksTable = ({ blocks, shardId }: { blocks: BlockType[]; shardId: number | undefined }) => {
  return (
    <div className="table-wrapper">
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
            <tr className="animated fadeIn" key={block.hash}>
              <td>
                <NetworkLink to={`/blocks/${block.hash}`} data-testid={`blockLink${i}`}>
                  {block.nonce}
                </NetworkLink>
              </td>
              <td>
                <span title={dateFormatted(block.timestamp)}>
                  <TimeAgo value={block.timestamp} />
                </span>
              </td>
              <td>{block.txCount}</td>
              <td>
                {shardId !== undefined ? (
                  <ShardSpan shardId={block.shardId} />
                ) : (
                  <NetworkLink
                    to={urlBuilder.shard(block.shardId)}
                    data-testid={`blockShardLink${i}`}
                  >
                    <ShardSpan shardId={block.shardId} />
                  </NetworkLink>
                )}
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
