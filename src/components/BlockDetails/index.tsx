import * as React from 'react';
import { useParams } from 'react-router-dom';
import { faChevronLeft, faChevronRight, faCube, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TimeAgo, Highlights, TestnetLink } from '../../sharedComponents';
import { getTransaction } from './helpers/asyncRequests';
import { useGlobalState } from '../../context';
import { BlockType } from '../Blocks';
import { dateFormatted, sizeFormat, truncate } from '../../helpers';

export type StateType = {
  block: BlockType;
  proposer: string;
  consensusItems: string[];
  nextHash: string;
};

export const initialState = {
  block: {
    hash: '',
    nonce: 0,
    prevHash: '',
    proposer: 0,
    pubKeyBitmap: '',
    round: 0,
    shardId: 0,
    size: 0,
    stateRootHash: '',
    timestamp: 0,
    txCount: 0,
    validators: [],
  },
  proposer: '',
  consensusItems: [],
  nextHash: '',
};

const BlockDetails: React.FC = () => {
  let { blockId } = useParams();
  let ref = React.useRef(null);
  const noBlockFoundTitle = '';

  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);

  React.useEffect(() => {
    if (blockId) {
      getTransaction(elasticUrl, blockId).then(data => ref.current !== null && setState(data));
    }
  }, [elasticUrl, blockId]); // run the operation only once since the parameter does not change

  const { block, proposer, consensusItems, nextHash } = state;

  return (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>Block Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              {noBlockFoundTitle !== '' ? (
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faCube} className="empty-icon" />
                    <span className="h4 empty-heading">{noBlockFoundTitle}</span>
                    <span className="empty-details">{blockId}</span>
                  </div>
                </div>
              ) : (
                <div className="card-body card-details">
                  <div className="row">
                    <div className="col-lg-2 card-label">Block Height</div>
                    <div className="col-lg-10">
                      {block.nonce}
                      &nbsp;
                      <TestnetLink
                        to={`/blocks/${block.prevHash}`}
                        className="btn btn-outline-secondary btn-sm"
                        title="View previous block"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </TestnetLink>
                      &nbsp;
                      <TestnetLink
                        to={`/blocks/${nextHash}`}
                        className="btn btn-outline-secondary btn-sm"
                        title="View next block"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </TestnetLink>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Timestamp</div>
                    <div className="col-lg-10">
                      &nbsp;
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      <TimeAgo value={block.timestamp} />
                      &nbsp;({dateFormatted(block.timestamp)})
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Transactions</div>
                    <div className="col-lg-10">{block.txCount + ' transactions in this block'}</div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Shard ID</div>
                    <div className="col-lg-10">
                      <TestnetLink to={`/shards/${block.shardId}/page/1`}>
                        {block.shardId}
                      </TestnetLink>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Size</div>
                    <div className="col-lg-10">{sizeFormat(block.size)}</div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Proposer</div>
                    <div className="col-lg-10">
                      {proposer === '' ? (
                        <span className="text-muted">N/A</span>
                      ) : (
                        <TestnetLink to={`/validator/${proposer}`}>
                          {truncate(proposer, 100)}
                        </TestnetLink>
                      )}
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Consensus group</div>
                    <div className="col-lg-10">
                      {consensusItems.length === 0 ? (
                        <span className="text-muted">N/A</span>
                      ) : (
                        <>
                          {consensusItems.map(item => (
                            <TestnetLink className="hash" key={item} to={`/validator/${item}`}>
                              {truncate(item, 100)}
                            </TestnetLink>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Block Hash</div>
                    <div className="col-lg-10">{block.hash}</div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">State Root Hash</div>
                    <div className="col-lg-10">{block.stateRootHash}</div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Previous Hash</div>
                    <div className="col-lg-10">
                      <TestnetLink className="hash" to={`/block/${block.prevHash}`}>
                        {block.prevHash}
                      </TestnetLink>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-2 card-label">Public Keys Bitmap</div>
                    <div className="col-lg-10">{block.pubKeyBitmap}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
