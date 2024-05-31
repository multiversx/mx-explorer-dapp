import {
  NetworkLink,
  TimeAgo,
  Trim,
  BlockGasUsed,
  IdentityBlock,
  ShardLink
} from 'components';
import { formatSize } from 'helpers';
import { useIsSovereign } from 'hooks';
import { BlockType } from 'types';

export const BlocksTable = ({
  blocks,
  showProposerIdentity
}: {
  blocks: BlockType[];
  shard: number | undefined;
  showProposerIdentity?: boolean;
}) => {
  const isSovereign = useIsSovereign();
  return (
    <div className='blocks-table table-wrapper animated-list'>
      <table className='table mb-0'>
        <thead>
          <tr>
            <th>Block</th>
            <th>Age</th>
            <th>Txns</th>
            <th>{isSovereign ? 'Chain' : 'Shard'}</th>
            <th className='text-end'>Size</th>
            <th className='text-end'>Gas Used</th>
            <th className={showProposerIdentity ? '' : 'text-end'}>
              Block Hash
            </th>
            {showProposerIdentity && <th>Leader</th>}
          </tr>
        </thead>
        <tbody data-testid='blocksTable'>
          {blocks.map((block, i) => (
            <tr
              key={block.hash}
              className={`animated-row ${block.isNew ? 'new' : ''}`}
            >
              <td>
                <div className='d-flex'>
                  <NetworkLink
                    to={`/blocks/${block.hash}`}
                    data-testid={`blockLink${i}`}
                  >
                    {block.nonce}
                  </NetworkLink>
                </div>
              </td>
              <td>
                <TimeAgo value={block.timestamp} tooltip />
              </td>
              <td>{block.txCount}</td>
              <td>
                <ShardLink
                  shard={block.shard}
                  data-testid={`blockShardLink${i}`}
                  hasHighlight
                />
              </td>
              <td className='text-end'>
                {block.sizeTxs !== undefined
                  ? formatSize(block.size + block.sizeTxs)
                  : formatSize(block.size)}
              </td>

              <td>
                <div
                  className='d-flex justify-content-end pb-1'
                  style={{ marginTop: '9px' }}
                >
                  <div className='d-flex flex-column align-items-end'>
                    <BlockGasUsed block={block} />
                  </div>
                </div>
              </td>
              <td>
                <div
                  className={
                    showProposerIdentity ? '' : 'd-flex justify-content-end'
                  }
                >
                  <NetworkLink
                    to={`/blocks/${block.hash}`}
                    data-testid={`blockHashLink${i}`}
                    className='trim-wrapper trim-size-xl'
                  >
                    <Trim text={block.hash} />
                  </NetworkLink>
                </div>
              </td>
              {showProposerIdentity && (
                <td className='identity-block'>
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
