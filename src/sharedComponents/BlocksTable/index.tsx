import React from 'react';
import { TestnetLink, TimeAgo, ShardSpan } from './../index';
import { dateFormatted, sizeFormat, truncate } from './../../helpers';
import { BlockType } from './../../components/Blocks';

const BlocksTable = ({ blocks, shardId }: { blocks: BlockType[]; shardId: number | undefined }) => {
  return (
    <div className="table-responsive">
      <table className="table mt-4">
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
        <tbody>
          {blocks.map((block, i) => (
            <tr ng-repeat="block in blocks" className="animated fadeIn" key={block.hash}>
              <td>
                <TestnetLink to={`/blocks/${block.hash}`}>{block.nonce}</TestnetLink>
              </td>
              <td>
                <span title={dateFormatted(block.timestamp)}>
                  <TimeAgo value={block.timestamp} />
                </span>
              </td>
              <td>{block.txCount}</td>
              <td>
                {shardId ? (
                  <ShardSpan shardId={block.shardId} />
                ) : (
                  <TestnetLink to={`/blocks/shards/${block.shardId}`}>
                    <ShardSpan shardId={block.shardId} />
                  </TestnetLink>
                )}
              </td>
              <td>{sizeFormat(block.size)}</td>
              <td>
                <TestnetLink to={`/blocks/${block.hash}`}>{truncate(block.hash, 20)}</TestnetLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
