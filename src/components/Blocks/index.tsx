import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getBlocks } from './helpers/asyncRequests';
import Highlights from './../../sharedComponents/Highlights';
import filters from './../../helpers/filters';
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

const Blocks: React.FC = () => {
  let { page } = useParams();
  let ref = React.useRef(null);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const [blocks, setBlocks] = React.useState<BlockType[]>([]);

  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();

  React.useEffect(() => {
    getBlocks({ elasticUrl, size }).then(data => {
      if (ref.current !== null) {
        setBlocks(data);
      }
    });
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
                <div className="float-right">
                  {/* <a href="/#/blocks/page/1" class="btn btn-outline-secondary btn-sm" ng-class="{disabled: currentPage == 1}">First</a> */}
                  <a
                    href="{{ prevPage }}"
                    className="btn btn-outline-secondary btn-sm"
                    ng-class="{disabled: currentPage == 1}"
                  >
                    <i className="fa fa-chevron-left" />
                  </a>
                  <span className="ml-1 mr-1">
                    Page {'{'}
                    {'{'} currentPage {'}'}
                    {'}'}
                  </span>
                  <a href="{{ nextPage }}" className="btn btn-outline-secondary btn-sm">
                    <i className="fa fa-chevron-right" />
                  </a>
                </div>
                {'{'}
                {'{'} startBlockNr ? 'Block #' + startBlockNr + ' to #' + endBlockNr : '' {'}'}
                {'}'}
                {'{'}
                {'{'} totalBlocks ? '(Total of ' + totalBlocks + ' blocks)' : '' {'}'}
                {'}'}
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
                      {blocks.map((block, i) => (
                        <tr
                          ng-repeat="block in blocks"
                          className="animated fadeIn"
                          key={JSON.stringify(block) + i}
                        >
                          <td>
                            <a href="/#/block/{{ block.hash }}">{block.nonce}</a>
                          </td>
                          <td>
                            <span title="{{ block.timestamp * 1000 | date:'medium' }}">
                              {filters.timestampAge(block.timestamp * 1000)}
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
                          <td>{filters.sizeFormat(block.size)}</td>
                          <td>
                            <a href="./#/block/{{block.hash}}">
                              {filters.truncate(block.hash, 20)}
                            </a>
                          </td>
                        </tr>
                      ))}
                      {blocks.length === 0 && (
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
