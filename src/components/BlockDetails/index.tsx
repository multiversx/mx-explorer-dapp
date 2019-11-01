import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  faExchangeAlt,
  faHourglass,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScAddressIcon, Denominate, TimeAgo, Highlights } from '../../sharedComponents';
import { getTransaction } from './helpers/asyncRequests';
import { useGlobalState } from '../../context';
import { TransactionType } from '../Transactions';
import { dateFormatted } from '../../helpers';

// TODO: remove Angular logic

const BlockDetails: React.FC = () => {
  let { transactionId } = useParams();
  let ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>(undefined);

  React.useEffect(() => {
    if (transactionId) {
      getTransaction(elasticUrl, transactionId).then(
        data => ref.current !== null && setTransaction(data)
      );
    }
  }, [elasticUrl, transactionId]); // run the operation only once since the parameter does not change

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
              <div ng-show="noBlockFoundTitle != ''" className="card-body card-details">
                <div className="empty">
                  <i className="fa fa-cube empty-icon" />
                  <span className="h4 empty-heading">
                    {'{'}
                    {'{'}noBlockFoundTitle{'}'}
                    {'}'}
                  </span>
                  <span className="empty-details">
                    {'{'}
                    {'{'}noBlockFoundDescription{'}'}
                    {'}'}
                  </span>
                </div>
              </div>
              <div ng-show="noBlockFoundTitle == ''" className="card-body card-details">
                <div className="row">
                  <div className="col-lg-2 card-label">Block Height</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'}number{'}'}
                    {'}'}
                    <a
                      href="./#/block/{{ prevHash }}"
                      className="btn btn-outline-secondary btn-sm"
                      title="View previous block"
                    >
                      <i className="fa fa-chevron-left" />
                    </a>
                    <a
                      href="./#/block/{{ nextHash }}"
                      className="btn btn-outline-secondary btn-sm"
                      ng-class="{disabled: nextHash == '' }"
                      title="View next block"
                    >
                      <i className="fa fa-chevron-right" />
                    </a>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Timestamp</div>
                  <div className="col-lg-10">
                    &nbsp;
                    <i className="fa fa-clock mr-2" />
                    {'{'}
                    {'{'} timestamp ? (timestamp * 1000 | timestampAge) : '' {'}'}
                    {'}'}
                    {'{'}
                    {'{'} transaction.timestamp ? '(' + (transaction.timestamp * 1000 |
                    date:'medium') + ')' : '' {'}'}
                    {'}'}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Transactions</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'}txCount{'}'}
                    {'}'}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Shard ID</div>
                  <div className="col-lg-10">
                    <a href="/#/shard/{{ shardId }}/page/1">
                      {'{'}
                      {'{'} shardId {'}'}
                      {'}'}
                    </a>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Size</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'}size | sizeFormat{'}'}
                    {'}'}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Proposer</div>
                  <div className="col-lg-10">
                    <span className="text-muted" ng-show="!proposer">
                      N/A
                    </span>
                    <a href="#/validator/{{proposer}}" ng-show="proposer">
                      {'{'}
                      {'{'}proposer | truncate : 100{'}'}
                      {'}'}
                    </a>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Consensus group</div>
                  <div className="col-lg-10">
                    <span className="text-muted" ng-show="consensusItems.length == 0">
                      N/A
                    </span>
                    <span ng-repeat="item in consensusItems">
                      <a href="#/validator/{{item}}" ng-show="item" className="hash">
                        {'{'}
                        {'{'}item | truncate : 100{'}'}
                        {'}'}
                      </a>
                    </span>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Block Hash</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'} hash {'}'}
                    {'}'}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">State Root Hash</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'} stateRootHash {'}'}
                    {'}'}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Previous Hash</div>
                  <div className="col-lg-10">
                    <a href="./#/block/{{ prevHash }}">
                      {'{'}
                      {'{'} prevHash {'}'}
                      {'}'}
                    </a>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Public Keys Bitmap</div>
                  <div className="col-lg-10">
                    {'{'}
                    {'{'} pubKeyBitmap {'}'}
                    {'}'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
