import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from 'context';
import { dateFormatted } from 'helpers';
import { ShardSpan, NetworkLink, TimeAgo, adapter, Trim, Loader } from 'sharedComponents';
import { BlockType } from 'sharedComponents/Adapter/functions/getBlock';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';

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
  const [blocksFetched, setBlocksFetched] = React.useState<boolean | undefined>();

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
        {blocksFetched === undefined && <Loader dataTestId="blocksLoader" />}
        {blocksFetched === false && <FailedBlocks />}
        {blocksFetched === true && blocks.length === 0 && <NoBlocks />}
        {blocksFetched === true && blocks.length > 0 && (
          <>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h6 className="m-0">Latest Blocks</h6>
              <NetworkLink to="/blocks">View All Blocks</NetworkLink>
            </div>
            <div className="card-body card-scroll py-0">
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
                            <NetworkLink to={`/blocks/${block.hash}`} data-testid={`blockLink${i}`}>
                              {block.nonce}
                            </NetworkLink>
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

                        <NetworkLink to={`/blocks/${block.hash}`} className="trim-wrapper">
                          <Trim dataTestId={`blockHashLink${i}`} text={block.hash} />
                        </NetworkLink>
                      </div>
                      <div>{block.txCount} txns</div>
                    </div>
                  </div>
                ))}
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
