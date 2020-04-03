import { BlockType } from 'components/Blocks';
import { dateFormatted, sizeFormat, trimHash } from 'helpers';
import React from 'react';
import { ShardSpan, TestnetLink, TimeAgo } from './../index';

const BlocksTable = ({
  blocks,
  shardId,
  epochId,
}: {
  blocks: BlockType[];
  shardId: number | undefined;
  epochId: number | undefined;
}) => {
  return (
    <div className="table-responsive">
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Block</th>
            <th>Epoch</th>
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
                <TestnetLink to={`/blocks/${block.hash}`} data-testid={`blockLink${i}`}>
                  {block.nonce}
                </TestnetLink>
              </td>
              <td>
                {epochId !== undefined ? (
                  epochId
                ) : (
                  <TestnetLink
                    to={`/blocks/epoch/${block.epoch}`}
                    data-testid={`blockShardLink${i}`}
                  >
                    {block.epoch}
                  </TestnetLink>
                )}
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
                  <TestnetLink
                    to={`/blocks/shards/${block.shardId}`}
                    data-testid={`blockShardLink${i}`}
                  >
                    <ShardSpan shardId={block.shardId} />
                  </TestnetLink>
                )}
              </td>
              <td>{sizeFormat(block.size)}</td>
              <td>
                <TestnetLink to={`/blocks/${block.hash}`} data-testid={`blockHashLink${i}`}>
                  {trimHash(block.hash)}
                </TestnetLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
