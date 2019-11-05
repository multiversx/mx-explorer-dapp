import * as React from 'react';
const LatestBlocks: React.FC = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center flex-row mb-3">
          <h4 className="card-title mb-0 mr-auto">Latest Blocks</h4>
          <a href="/#/blocks/page/1">View All Blocks</a>
        </div>
        <div className="card-scroll">
          <div ng-repeat="block in blocks" className="animated fadeIn">
            <div className="row">
              <div className="col-6">
                <span className="icon-container">
                  <i className="fa fa-cube" />
                </span>
                <a href="/#/block/{{ block.hash }}">
                  {'{'}
                  {'{'} block.nonce {'}'}
                  {'}'}
                </a>{' '}
                in shard {'{'}
                {'{'} block.shardId {'}'}
                {'}'}
                <br />
                <span
                  className="text-secondary"
                  title="{{ block.timestamp * 1000 | date:'medium' }}"
                >
                  {'{'}
                  {'{'} block.timestamp * 1000 | timestampAge {'}'}
                  {'}'}
                </span>
              </div>
              <div className="col-6">
                Hash{' '}
                <a href="/#/block/{{ block.hash }}">
                  {'{'}
                  {'{'} block.hash | truncate : 20 {'}'}
                  {'}'}
                </a>
                <br />
                {'{'}
                {'{'} block.txCount {'}'}
                {'}'} txns
              </div>
            </div>
            <div ng-if="$last == false">
              <hr className="hr-space" style={{}} />
            </div>
          </div>
          <div ng-show="!blocks" className="row h-100 justify-content-center align-items-center">
            <div className="col-12 text-center">
              <div className="lds-ellipsis mx-auto">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LatestBlocks;
