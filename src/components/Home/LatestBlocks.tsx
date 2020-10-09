import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from 'context';
import { dateFormatted } from 'helpers';
import { ShardSpan, TestnetLink, TimeAgo, adapter, TrimHash } from 'sharedComponents';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';

type LatestBlockType = BlockType & {
  isNew: boolean;
};

const LatestBlocks: React.FC = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [blocks, setBlocks] = React.useState<LatestBlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = React.useState<boolean>(true);

  const { getLatestBlocks } = adapter();

  const fetchBlocks = () => {
    if (ref.current !== null) {
      getLatestBlocks().then(({ data, blocksFetched }) => {
        if (ref.current !== null) {
          if (blocksFetched) {
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
            setBlocksFetched(true);
          } else if (blocks.length === 0) {
            setBlocksFetched(false);
          }
        }
      });
    }
  };

  React.useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = blocks.some((block) => block.isNew);
    return (
      <div className="card card-small" ref={ref}>
        {!blocksFetched ? (
          // TODO page state
          <div className="card-body card-details" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faCube} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load blocks</span>
            </div>
          </div>
        ) : (
          <>
            <div className="card-header border-bottom d-flex justify-content-between">
              <h6 className="m-0">Latest Blocks</h6>
              <small>
                <TestnetLink to="/blocks">View All Blocks</TestnetLink>
              </small>
            </div>
            <div className="card-body card-scroll py-0">
              {blocks.length ? (
                <div className="animated-list" data-testid="blocksList">
                  {blocks.map((block, i) => (
                    <div
                      key={block.hash}
                      className={`row animated-row ${block.isNew && someNew ? 'new' : ''}`}
                    >
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <div className="list-item-icon mr-3">
                            <FontAwesomeIcon icon={faCube} />
                          </div>
                          <div className="d-flex flex-column list-item-text">
                            <span className="text-secondary">
                              <TestnetLink
                                to={`/blocks/${block.hash}`}
                                data-testid={`blockLink${i}`}
                              >
                                {block.nonce}
                              </TestnetLink>
                              &nbsp;in&nbsp;
                              <ShardSpan shardId={block.shardId} />
                            </span>
                            <span title={dateFormatted(block.timestamp)} className="text-muted">
                              <TimeAgo value={block.timestamp} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 list-item-text text-secondary">
                        <div className="trim-hash-outer">
                          <span className="text-nowrap mr-2">Hash</span>

                          <div className="trim-hash-inner">
                            <TestnetLink
                              to={`/blocks/${block.hash}`}
                              data-testid={`blockHashLink${i}`}
                            >
                              <TrimHash text={block.hash} />
                            </TestnetLink>
                          </div>
                        </div>
                        <div>{block.txCount} txns</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // TODO page state loader?
                <div
                  className="row h-100 justify-content-center align-items-center"
                  data-testid="blocksLoader"
                >
                  <div className="col-12 text-center">
                    <div className="lds-ellipsis mx-auto">
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [blocks, blocksFetched]);
};
export default LatestBlocks;
