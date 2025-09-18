import { ELLIPSIS } from 'appConstants';
import {
  NetworkLink,
  TimeAgo,
  Trim,
  BlockGasUsed,
  IdentityBlock,
  ShardLink,
  ShardFilter,
  Pager,
  ShardSpan,
  TableWrapper,
  PageSize,
  ColSpanWrapper,
  Loader
} from 'components';
import { formatSize } from 'helpers';
import { useIsSovereign } from 'hooks';
import { UIBlockType, WithClassnameType } from 'types';
import { FailedBlocks } from './components/FailedBlocks';
import { NoBlocks } from './components/NoBlocks';

export interface BlocksTableUIType extends WithClassnameType {
  blocks: UIBlockType[];
  totalBlocks: number | typeof ELLIPSIS;
  shard: number | undefined;
  showProposerIdentity?: boolean;
  dataChanged?: boolean;
  isDataReady?: boolean;
}

export const BlocksTable = ({
  blocks,
  totalBlocks,
  shard,
  showProposerIdentity,
  dataChanged,
  isDataReady
}: BlocksTableUIType) => {
  const isSovereign = useIsSovereign();
  const colSpan = showProposerIdentity ? 8 : 7;

  return (
    <div className='blocks-table table-wrapper animated-list'>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <h5
              className='table-title d-flex align-items-center'
              data-testid='title'
            >
              Blocks
              {shard !== undefined && shard >= 0 && (
                <span className='ms-1'>
                  from <ShardSpan shard={shard} />
                </span>
              )}
            </h5>
            <Pager total={totalBlocks} show={blocks.length > 0} />
          </div>
        </div>

        <div className='card-body'>
          <TableWrapper dataChanged={dataChanged}>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Age</th>
                  <th>Txns</th>
                  <th>
                    <ShardFilter text={isSovereign ? 'Chain' : 'Shard'} />
                  </th>
                  <th className='text-end'>Size</th>
                  <th className='text-end'>Gas Used</th>
                  <th className={showProposerIdentity ? '' : 'text-end'}>
                    Block Hash
                  </th>
                  {showProposerIdentity && <th>Leader</th>}
                </tr>
              </thead>
              <tbody data-testid='blocksTable'>
                {isDataReady === undefined && (
                  <ColSpanWrapper colSpan={colSpan}>
                    <Loader />
                  </ColSpanWrapper>
                )}
                {isDataReady === false && (
                  <ColSpanWrapper colSpan={colSpan}>
                    <FailedBlocks />
                  </ColSpanWrapper>
                )}
                {isDataReady === true && (
                  <>
                    {blocks.length > 0 ? (
                      <>
                        {blocks.map((block, i) => (
                          <tr
                            key={block.hash}
                            className={`animated-row ${
                              block.isNew ? 'new' : ''
                            }`}
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
                                  showProposerIdentity
                                    ? ''
                                    : 'd-flex justify-content-end'
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
                      </>
                    ) : (
                      <>
                        <ColSpanWrapper colSpan={colSpan}>
                          <NoBlocks />
                        </ColSpanWrapper>
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </div>

        <div className='card-footer table-footer'>
          <PageSize />
          <Pager total={totalBlocks} show={blocks.length > 0} />
        </div>
      </div>
    </div>
  );
};
