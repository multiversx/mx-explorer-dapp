import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsHash, testnetRoute } from 'helpers';
import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loader, ShardSpan, TestnetLink } from 'sharedComponents';
import { getMiniBlock } from './helpers/asyncRequests';

interface MiniBlockType {
  senderShard: number;
  receiverShard: number;
  senderBlockHash: string;
  receiverBlockHash: string;
  type: string;
  hash: string;
}

export interface StateType {
  miniBlock: MiniBlockType;
  blockFetched: boolean;
}

export const initialState = {
  miniBlock: {
    senderShard: 0,
    receiverShard: 0,
    senderBlockHash: '',
    receiverBlockHash: '',
    type: '',
    hash: '',
  },
  blockFetched: true,
};

const MiniBlockDetails: React.FC = () => {
  const { hash: blockId } = useParams();
  const history = useHistory();

  const ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    activeTestnetId,
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);

  if (blockId && !addressIsHash(blockId)) {
    history.push(testnetRoute({ to: `/not-found`, activeTestnetId }));
  }

  React.useEffect(() => {
    if (blockId) {
      getMiniBlock({ elasticUrl, blockId, timeout }).then(
        (data: any) => ref.current !== null && setState(data)
      );
    }
  }, [elasticUrl, blockId, timeout]); // run the operation only once since the parameter does not change

  const { miniBlock, blockFetched } = state;

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Miniblock Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!blockFetched ? (
              <div className="card">
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faCube} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this miniblock hash</span>
                    <span className="empty-details">{blockId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {miniBlock.hash ? (
                  <div className="card">
                    <div className="card-body card-details">
                      <div className="row">
                        <div className="col-lg-2 card-label">Sender Shard</div>
                        <div className="col-lg-10">
                          <TestnetLink to={`/blocks/shards/${miniBlock.senderShard}`}>
                            <ShardSpan shardId={miniBlock.senderShard} />
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Receiver Shard</div>
                        <div className="col-lg-10">
                          <TestnetLink to={`/blocks/shards/${miniBlock.receiverShard}`}>
                            <ShardSpan shardId={miniBlock.receiverShard} />
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Sender Block</div>
                        <div className="col-lg-10">
                          <TestnetLink className="hash" to={`/blocks/${miniBlock.senderBlockHash}`}>
                            {miniBlock.senderBlockHash}
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Receiver Block</div>
                        <div className="col-lg-10">
                          <TestnetLink
                            className="hash"
                            to={`/blocks/${miniBlock.receiverBlockHash}`}
                          >
                            {miniBlock.receiverBlockHash}
                          </TestnetLink>
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Type</div>
                        <div className="col-lg-10">{miniBlock.type}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniBlockDetails;
