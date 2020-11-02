import * as React from 'react';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';
import { dateFormatted, sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim } from 'sharedComponents';

const BlocksTable = ({ blocks, shardId }: { blocks: BlockType[]; shardId: number | undefined }) => {
  return (
    <div className="table-wrapper">
      <table className="table m-0">
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
                <NetworkLink to={`/blocks/${block.hash}`} data-testid={`blockHashLink${i}`}>
                  <Trim text={block.hash} />
                </NetworkLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
