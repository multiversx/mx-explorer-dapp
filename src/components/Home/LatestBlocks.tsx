import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from 'context';
import { dateFormatted } from 'helpers';
import {
  ShardSpan,
  TestnetLink,
  TimeAgo,
  adapter,
  Trim,
  PageState,
  Loader,
} from 'sharedComponents';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';

type LatestBlockType = BlockType & {
  isNew: boolean;
};

const LatestBlocks = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [blocks, setBlocks] = React.useState<LatestBlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = React.useState(true);

  const { getLatestBlocks } = adapter();

  const fetchBlocks = () => {
    getLatestBlocks().then(({ data, blocksFetched }) => {
      if (ref.current !== null) {
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
        setBlocksFetched(blocksFetched);
      }
    });
  };

  React.useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = blocks.some((block) => block.isNew);
    return (
      <div className="card card-small" ref={ref}>
        {!blocksFetched ? (
          <div className="card-body">
            <PageState
              icon={faCube}
              title={'Unable to load blocks'}
              className="py-spacer d-flex h-100 align-items-center justify-content-center"
              dataTestId="errorScreen"
            />
          </div>
        ) : (
          <>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h6 className="m-0">Latest Blocks</h6>
              <TestnetLink to="/blocks">View All Blocks</TestnetLink>
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
                        <div className="d-flex align-items-center">
                          <span className="mr-2">Hash</span>

                          <TestnetLink to={`/blocks/${block.hash}`} className="trim-wrapper">
                            <Trim dataTestId={`blockHashLink${i}`} text={block.hash} />
                          </TestnetLink>
                        </div>
                        <div>{block.txCount} txns</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Loader dataTestId="blocksLoader" />
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
