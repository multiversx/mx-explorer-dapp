import * as React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  adapter,
  Trim,
  Loader,
  LatestItem,
} from 'sharedComponents';
import { BlockType } from 'sharedComponents/BlocksTable';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';
import { urlBuilder } from 'helpers';

const LatestBlocks = ({ proposer }: { proposer?: string }) => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();

  const { getLatestBlocks } = adapter();

  const [blocks, setBlocks] = React.useState<BlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = React.useState<boolean | undefined>();
  const size = 6;
  const params = proposer ? { proposer, size } : { size };

  const fetchBlocks = () => {
    getLatestBlocks(params).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const existingHashes = blocks.map((b) => b.hash);

          // keep first 4 items and reset them
          let newBlocks: BlockType[] = [...blocks.slice(0, 4)];
          newBlocks.forEach((block) => (block.isNew = false));

          data.forEach((block: BlockType) => {
            const isNew = !existingHashes.includes(block.hash);
            if (isNew) {
              newBlocks.unshift({
                ...block,
                isNew,
              });
            }
          });

          const allNew = newBlocks.filter((a) => a.isNew === true).length === newBlocks.length;
          if (allNew) {
            newBlocks.forEach((block) => (block.isNew = false));
          }

          setBlocks(newBlocks);
        }
        setBlocksFetched(success);
      }
    });
  };

  React.useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    return (
      <div className="card custom-scroll" ref={ref}>
        {blocksFetched === undefined && <Loader dataTestId="blocksLoader" />}
        {blocksFetched === false && <FailedBlocks />}
        {blocksFetched === true && blocks.length === 0 && <NoBlocks />}
        {blocksFetched === true && blocks.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item d-flex justify-content-between align-items-center">
                {proposer ? (
                  <h6 className="m-0">Latest proposed Blocks</h6>
                ) : (
                  <>
                    <h6 className="m-0">Blocks</h6>
                    <NetworkLink to="/blocks" className="btn btn-sm btn-primary-light">
                      View All Blocks
                    </NetworkLink>
                  </>
                )}
              </div>
            </div>
            <div className="card-body p-0" data-testid="blocksList">
              <div className="latest-items-container">
                {blocks.map((block, i) => (
                  <LatestItem maxNewItems={size} key={block.hash} isNew={block.isNew} index={i + 1}>
                    <div className="latest-item-card">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="latest-item-icon mr-2">
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
                      <div className="d-flex flex-row">
                        <span className="mr-2 text-secondary">Hash:</span>
                        <NetworkLink to={`/blocks/${block.hash}`} className="trim-wrapper">
                          <Trim dataTestId={`blockHashLink${i}`} text={block.hash} />
                        </NetworkLink>
                      </div>
                      <div className="mt-1">
                        <span className="text-secondary mr-2">Transactions:</span> {block.txCount}
                        <span className="text-muted mx-2">•</span>
                        <NetworkLink to={urlBuilder.shard(block.shard)} className="flex-shrink-0">
                          <ShardSpan shard={block.shard} />
                        </NetworkLink>
                      </div>
                    </div>
                  </LatestItem>
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
