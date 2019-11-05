import * as React from 'react';
const LatestTransactions: React.FC = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center flex-row mb-3">
          <h4 className="card-title mb-0 mr-auto">Latest Transactions</h4>
          <a href="/#/txs/page/1">View All Transactions</a>
        </div>
        <div className="card-scroll">
          <div ng-repeat="tx in transactions track by $index-async" className="animated fadeIn">
            <div className="row">
              <div className="col-6">
                <span className="icon-container-round">
                  <i className="fa fa-exchange-alt" />
                </span>
                <a href="/#/tx/{{ tx.hash }}">
                  {'{'}
                  {'{'} tx.hash | truncate : 20 {'}'}
                  {'}'}
                </a>
                <br />
                <span className="text-secondary" title="{{ tx.timestamp * 1000 | date:'medium' }}">
                  {'{'}
                  {'{'} tx.timestamp * 1000 | timestampAge {'}'}
                  {'}'}
                </span>
              </div>
              <div className="col-6">
                From{' '}
                <a href="/#/address/{{ tx.sender }}">
                  {'{'}
                  {'{'} tx.sender | truncate : 20 {'}'}
                  {'}'}
                </a>
                <br />
                To{' '}
                <a href="/#/address/{{ tx.receiver }}">
                  {'{'}
                  {'{'} tx.receiver | truncate : 20 {'}'}
                  {'}'}
                </a>
              </div>
            </div>
            <div ng-if="$last == false">
              <hr className="hr-space" style={{}} />
            </div>
          </div>
          <div
            ng-show="!transactions"
            className="row h-100 justify-content-center align-items-center"
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
        </div>
      </div>
    </div>
  );
};
export default LatestTransactions;
