import React from 'react';
import Highlights from './Highlights';
import Pager from './Pager';

const Transactions: React.FC = () => (
  <div>
    <Highlights />
    <div className="container pt-3 pb-3">
      <div className="row">
        <div className="col-12">
          <h4>Transactions</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body card-list">
              <Pager />
              More than 6,895,491 transactions found
              <div className="table-responsive">
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">Txn Hash</th>
                      <th scope="col">Block</th>
                      <th scope="col">Age</th>
                      <th scope="col">Shard</th>
                      <th scope="col">From</th>
                      <th scope="col">To</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr ng-repeat="tx in transactions" className="animated fadeIn">
                      <td>
                        <a href="/#/tx/{{ tx.hash }}">5eac5afe3c7170ee5...</a>
                      </td>
                      <td>
                        <a href="./#/block/{{ tx.blockHash }}">bb9266655ac0a1485...</a>
                      </td>
                      <td>
                        <span title="{{ tx.timestamp * 1000 | date:'medium' }}">7 secs ago</span>
                      </td>
                      <td>
                        <a href="/#/shard/{{ tx.senderShard }}/page/1" className="d-inline">
                          2
                        </a>
                        &gt;
                        <a href="/#/shard/{{ tx.receiverShard }}/page/1" className="d-inline">
                          4
                        </a>
                      </td>
                      <td>
                        <i
                          ng-show="(tx.sender | limitTo : 20) == '00000000000000000000'"
                          className="fa fa-file-code w300 mr-1"
                        />
                        <a
                          href="/#/address/{{ tx.sender}}"
                          ng-show="tx.sender != addressId && checkAddress(tx.sender)"
                        >
                          Shard 2
                        </a>
                      </td>
                      <td>
                        <i
                          ng-show="(tx.receiver | limitTo : 20) == '00000000000000000000'"
                          className="fa fa-file-code w300 mr-1"
                        />
                        <a href="/#/address/{{ tx.receiver}}">aa65ccf14ab88b400...</a>
                      </td>
                      <td>0.2000</td>
                    </tr>
                    <tr ng-show="!transactions">
                      <td colSpan={7} className="text-center pt-5 pb-4 border-0">
                        <div className="lds-ellipsis">
                          <div />
                          <div />
                          <div />
                          <div />
                        </div>
                      </td>
                    </tr>
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

export default Transactions;
