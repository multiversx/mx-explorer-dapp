import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { isHash, testnetRoute } from 'helpers';
import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loader, ShardSpan, TestnetLink } from 'sharedComponents';
import { getMiniBlock, getTransactions, getTotalTransactions } from './helpers/asyncRequests';
import TransactionsTable from '../../sharedComponents/TransactionsTable';
import { TransactionType } from '../Transactions';
import NoTransactions from '../Transactions/NoTransactions';

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
  const { page, hash: miniBlockHash } = useParams();
  const history = useHistory();

  const ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    activeTestnetId,
    refresh: { timestamp },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);

  if (miniBlockHash && !isHash(miniBlockHash)) {
    history.push(testnetRoute({ to: `/not-found`, activeTestnetId }));
  }

  const { miniBlock, blockFetched } = state;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number | string>('...');

  const size = parseInt(page!) ? parseInt(page!) : 1;
  const slug = `miniblocks/${miniBlockHash}`;
  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({
        elasticUrl,
        size,
        miniBlockHash,
        timeout,
      }).then(({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            setTransactions(data);
            setTransactionsFetched(true);
          } else if (transactions.length === 0) {
            setTransactionsFetched(false);
          }
        }
      });
      getTotalTransactions({
        elasticUrl,
        miniBlockHash,
        timeout,
      }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(count);
        }
      });
    }
  };

  React.useEffect(() => {
    if (miniBlockHash) {
      getMiniBlock({ elasticUrl, miniBlockHash, timeout }).then(
        (data: any) => ref.current !== null && setState(data)
      );
    }
  }, [elasticUrl, miniBlockHash, timeout]); // run the operation only once since the parameter does not change

  React.useEffect(fetchTransactions, [elasticUrl, size, miniBlockHash, timeout, refreshFirstPage]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Miniblock Details</h4>
          </div>
        </div>

        {!blockFetched ? (
          <div className="row">
            <div className="col-12">
                <div className="card">
                  <div className="card-body card-details">
                    <div className="empty">
                      <FontAwesomeIcon icon={faCube} className="empty-icon" />
                      <span className="h4 empty-heading">Unable to locate this miniblock hash</span>
                      <span className="empty-details">{miniBlockHash}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        ) : (
          <>
            {miniBlock.hash ? (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body card-details">
                        <div className="row">
                          <div className="col-lg-2 card-label">Miniblock Hash</div>
                          <div className="col-lg-10">{miniBlockHash}</div>
                        </div>
                        <hr className="hr-space" />
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
                            {miniBlock.senderBlockHash !== '' ? (
                              <TestnetLink
                                className="hash"
                                to={`/blocks/${miniBlock.senderBlockHash}`}
                              >
                                {miniBlock.senderBlockHash}
                              </TestnetLink>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Receiver Block</div>
                          <div className="col-lg-10">
                            {miniBlock.receiverBlockHash !== '' ? (
                              <TestnetLink
                                className="hash"
                                to={`/blocks/${miniBlock.receiverBlockHash}`}
                              >
                                {miniBlock.receiverBlockHash}
                              </TestnetLink>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Type</div>
                          <div className="col-lg-10">{miniBlock.type}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
       
                <div className="row pt-3">
                  <div className="col-12">
                    <h4 data-testid="title">Transactions</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {!transactionsFetched ? (
                      <NoTransactions />
                    ) : (
                      <>
                        {transactions.length > 0 ? (
                          <TransactionsTable
                            transactions={transactions}
                            addressId={undefined}
                            totalTransactions={totalTransactions}
                            slug={slug}
                            size={size}
                          />
                        ) : (
                          <Loader />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Loader />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MiniBlockDetails;
