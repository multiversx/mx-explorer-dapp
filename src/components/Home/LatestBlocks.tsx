import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from 'context';
import { ShardSpan, NetworkLink, TimeAgo, adapter, Trim, Loader } from 'sharedComponents';
import { BlockType } from 'sharedComponents/BlocksTable';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';
import { urlBuilder } from 'helpers';

const LatestBlocks = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [blocks, setBlocks] = React.useState<BlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = React.useState<boolean | undefined>();

  const { getLatestBlocks } = adapter();

  const fetchBlocks = () => {
    getLatestBlocks().then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const sortedBlocks = data;
          if (blocks.length === 0) {
            const newBlocks = sortedBlocks.map((block: BlockType) => ({
              ...block,
              isNew: false,
            }));
            setBlocks(newBlocks);
          } else {
            const existingHashes = blocks.map((b) => b.hash);
            const newBlocks = sortedBlocks.map((block: BlockType) => ({
              ...block,
              isNew: !existingHashes.includes(block.hash),
            }));
            setBlocks(newBlocks);
          }
        }
        setBlocksFetched(success);
      }
    });
  };

  React.useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = blocks.some((block) => block.isNew);
    return (
      <div className="card" ref={ref}>
        {blocksFetched === undefined && <Loader dataTestId="blocksLoader" />}
        {blocksFetched === false && <FailedBlocks />}
        {blocksFetched === true && blocks.length === 0 && <NoBlocks />}
        {blocksFetched === true && blocks.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item d-flex justify-content-between align-items-center">
                <h6 className="m-0">Blocks</h6>
                <NetworkLink to="/blocks" className="btn btn-primary-light">
                  View All Blocks
                </NetworkLink>
              </div>
            </div>
            <div className="card-body" data-testid="blocksList">
              <div className="p-lg-2">
                <div className="block-card-container d-flex flex-row">
                  {blocks.map((block, i) => (
                    <div
                      key={block.hash}
                      className={`block-card p-3 ${block.isNew && someNew ? 'new' : ''}`}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="list-item-icon mr-2">
                            <FontAwesomeIcon icon={faCube} />
                          </div>
                          <NetworkLink to={`/blocks/${block.hash}`} data-testid={`blockLink${i}`}>
                            {block.nonce}
                          </NetworkLink>
                        </div>

                        <span className="text-secondary">
                          <TimeAgo value={block.timestamp} tooltip />
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="text-secondary">Transactions:</span> {block.txCount}
                        <span className="mx-2 text-secondary">|</span>
                        <NetworkLink to={urlBuilder.shard(block.shard)} className="flex-shrink-0">
                          <ShardSpan shard={block.shard} />
                        </NetworkLink>
                      </div>
                      <div className="d-flex flex-row">
                        <span className="mr-2 text-secondary">Hash:</span>
                        <NetworkLink to={`/blocks/${block.hash}`} className="trim-wrapper">
                          <Trim dataTestId={`blockHashLink${i}`} text={block.hash} />
                        </NetworkLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [blocks, blocksFetched]);
};
export default LatestBlocks;
