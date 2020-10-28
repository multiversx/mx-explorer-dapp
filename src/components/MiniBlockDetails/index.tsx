import { useGlobalState } from 'context';
import { isHash, networkRoute, urlBuilder } from 'helpers';
import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loader, ShardSpan, TestnetLink, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import { initialState } from 'sharedComponents/Adapter/functions/getMiniBlocks';
import MiniBlockNotFound from './MiniBlockNotFound';

interface MiniBlockType {
  senderShard: number;
  receiverShard: number;
  senderBlockHash: string;
  receiverBlockHash: string;
  type: string;
  miniBlockHash: string;
}

export interface StateType {
  miniBlock: MiniBlockType;
  blockFetched: boolean;
}

const MiniBlockDetails: React.FC = () => {
  const { page, hash: miniBlockHash } = useParams() as any;
  const history = useHistory();

  const ref = React.useRef(null);

  const provider = adapter();

  const {
    activeNetworkId,
    refresh: { timestamp },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);

  if (miniBlockHash && !isHash(miniBlockHash)) {
    history.push(networkRoute({ to: `/not-found`, activeNetworkId }));
  }

  const { miniBlock, blockFetched } = state;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const size = parseInt(page!) ? parseInt(page!) : 1;
  const slug = `miniblocks/${miniBlockHash}`;
  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      provider
        .getMiniBlockTransactions({
          size,
          miniBlockHash,
        })
        .then(({ data, success }) => {
          if (ref.current !== null) {
            if (success) {
              setTransactions(data);
              setTransactionsFetched(true);
            } else if (transactions.length === 0) {
              setTransactionsFetched(false);
            }
          }
        });
      provider
        .getMiniBlockTransactionsCount({
          miniBlockHash,
        })
        .then(({ count, success }) => {
          if (ref.current !== null && success) {
            setTotalTransactions(count);
          }
        });
    }
  };

  const getMiniBlock = () => {
    if (miniBlockHash) {
      provider
        .getMiniBlock({ miniBlockHash })
        .then((data: any) => ref.current !== null && setState(data));
    }
  };

  React.useEffect(getMiniBlock, [activeNetworkId, miniBlockHash, timeout]); // run the operation only once since the parameter does not change

  React.useEffect(fetchTransactions, [
    activeNetworkId,
    size,
    miniBlockHash,
    timeout,
    refreshFirstPage,
  ]); // run the operation only once since the parameter does not change

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
              <MiniBlockNotFound miniBlockHash={miniBlockHash} />
            </div>
          </div>
        ) : (
          <>
            {miniBlock.miniBlockHash ? (
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
                            <TestnetLink to={urlBuilder.shard(miniBlock.senderShard)}>
                              <ShardSpan shardId={miniBlock.senderShard} />
                            </TestnetLink>
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Receiver Shard</div>
                          <div className="col-lg-10">
                            <TestnetLink to={urlBuilder.shard(miniBlock.receiverShard)}>
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
