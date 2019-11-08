import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faCube } from '@fortawesome/free-solid-svg-icons';
import { getBlocks } from './helpers/asyncRequests';
import { TestnetLink, TimeAgo } from './../../sharedComponents';
import { BlockType } from './../Blocks';
import { useGlobalState } from '../../context';
import { truncate, dateFormatted } from './../../helpers';

const LatestBlocks: React.FC = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl },
    timeout,
    refresh: { timestamp },
  } = useGlobalState();
  const [blocks, setBlocks] = React.useState<BlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (ref.current !== null) {
      getBlocks({ elasticUrl, timeout }).then(({ data, blocksFetched }) => {
        ref.current !== null && setBlocks(data);
        ref.current !== null && setBlocksFetched(blocksFetched);
      });
    }
  }, [elasticUrl, timeout, timestamp]);
  return (
    <div className="card" ref={ref}>
      {!blocksFetched ? (
        <div className="card-body card-details" data-testid="errorScreen">
          <div className="empty">
            <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
            <span className="h4 empty-heading">Unable to load blocks</span>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <div className="d-flex align-items-center flex-row mb-3">
            <h4 className="card-title mb-0 mr-auto">Latest Blocks</h4>
            <TestnetLink to="/blocks">View All Blocks</TestnetLink>
          </div>
          <div className="card-scroll">
            {blocks.length ? (
              <div className="animated fadeIn">
                {blocks.map((block: BlockType, i) => (
                  <div key={block.hash}>
                    <div className="row">
                      <div className="col-6">
                        <span className="icon-container">
                          <i>
                            <FontAwesomeIcon icon={faCube} />
                          </i>
                        </span>
                        <TestnetLink to={`/blocks/${block.hash}`}>{block.nonce}</TestnetLink> in
                        shard {block.shardId}
                        <br />
                        <span title={dateFormatted(block.timestamp)} className="text-secondary">
                          <TimeAgo value={block.timestamp} />
                        </span>
                      </div>
                      <div className="col-6">
                        Hash
                        <TestnetLink to={`/block/${block.hash}`}>
                          {truncate(block.hash, 20)}
                        </TestnetLink>
                        <br />
                        {block.txCount} txns
                      </div>
                    </div>
                    {i !== blocks.length - 1 && <hr className="hr-space" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="row h-100 justify-content-center align-items-center">
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
        </div>
      )}
    </div>
  );
};
export default LatestBlocks;
