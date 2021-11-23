import * as React from 'react';
import BigNumber from 'bignumber.js';
import { sizeFormat, urlBuilder } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, Trim, PercentageBar } from 'sharedComponents';

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
  gasConsumed: number;
  gasRefunded: number;
  gasPenalized: number;
  maxGasLimit: number;
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
            <th className="text-right">Size</th>
            <th className="text-right">Gas Used</th>
            <th className="text-right">Block Hash</th>
          </tr>
        </thead>
        <tbody data-testid="blocksTable">
          {blocks.map((block, i) => {
            const gasUsedBn = new BigNumber(block.gasConsumed)
              .minus(block.gasRefunded)
              .minus(block.gasPenalized);

            return (
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
                    {gasUsedBn.isGreaterThan(0) &&
                    new BigNumber(block.maxGasLimit).isGreaterThan(0) ? (
                      <>
                        <div className="d-flex flex-column align-items-end">
                          <div className="text-right mb-1">
                            {gasUsedBn.toFormat()}{' '}
                            <span className="text-secondary">
                              ({gasUsedBn.dividedBy(block.maxGasLimit).times(100).toFormat(2)}%)
                            </span>
                          </div>
                          <PercentageBar
                            overallPercent={0}
                            fillPercent={gasUsedBn
                              .dividedBy(block.maxGasLimit)
                              .times(100)
                              .toNumber()}
                            fillPercentLabel={`${gasUsedBn
                              .dividedBy(block.maxGasLimit)
                              .times(100)
                              .toFormat(2)}%`}
                            type="small"
                          />
                        </div>
                      </>
                    ) : (
                      <>N/A</>
                    )}
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-end mr-spacer">
                    <NetworkLink
                      to={`/blocks/${block.hash}`}
                      data-testid={`blockHashLink${i}`}
                      className="trim-wrapper trim-size-xl mr-xl-n5"
                    >
                      <Trim text={block.hash} />
                    </NetworkLink>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BlocksTable;
