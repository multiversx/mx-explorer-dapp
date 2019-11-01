import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getBlocks, getTotalBlocks } from './helpers/asyncRequests';
import { Highlights, TimeAgo, Pager, TestnetLink } from './../../sharedComponents';
import { truncate, sizeFormat } from './../../helpers';
import { useGlobalState } from '../../context';

type BlockType = {
  hash: string;
  nonce: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: Array<number>;
};

type StateType = {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
};

const initialState = {
  blocks: [],
  startBlockNr: 0,
  endBlockNr: 0,
};

const Blocks: React.FC = () => {
  let { page } = useParams();
  let ref = React.useRef(null);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const [state, setState] = React.useState<StateType>(initialState);
  const [totalBlocks, setTotalBlocks] = React.useState<number>(0);

  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();

  React.useEffect(() => {
    getBlocks({ elasticUrl, size }).then(data => ref.current !== null && setState(data));
    getTotalBlocks(elasticUrl).then(data => ref.current !== null && setTotalBlocks(data));
  }, [elasticUrl, size]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>Blocks</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-list">
                <Pager slug="blocks" />
                {state.startBlockNr > 0 && `Block #${state.startBlockNr} to #${state.endBlockNr}`}
                &nbsp;
                {totalBlocks > 0 && `(Total of ${totalBlocks.toLocaleString('en')} blocks)`}
                <div className="table-responsive">
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>Block</th>
                        <th>Age</th>
                        <th>Txns</th>
                        <th>Shard</th>
                        <th>Size</th>
                        <th>Block Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.blocks.map((block, i) => (
                        <tr
                          ng-repeat="block in blocks"
                          className="animated fadeIn"
                          key={block.hash}
                        >
                          <td>
                            <TestnetLink to={`/blocks/${block.hash}`}>{block.nonce}</TestnetLink>
                          </td>
                          <td>
                            <span title="{{ block.timestamp * 1000 | date:'medium' }}">
                              <TimeAgo value={block.timestamp} />
                            </span>
                          </td>
                          <td>{block.txCount}</td>
                          <td>
                            <a href="/#/shard/{{ block.shardId }}/page/1">
                              <span ng-show="getShardLabel(block.shardId) == 'Metachain'">
                                Metachain
                              </span>
                              <span ng-show="getShardLabel(block.shardId) != 'Metachain'">
                                Shard {block.shardId}
                              </span>
                            </a>
                          </td>
                          <td>{sizeFormat(block.size)}</td>
                          <td>
                            <a href="./#/block/{{block.hash}}">{truncate(block.hash, 20)}</a>
                          </td>
                        </tr>
                      ))}
                      {state.blocks.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center pt-5 pb-4 border-0">
                            <div className="lds-ellipsis">
                              <div />
                              <div />
                              <div />
                              <div />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocks;
