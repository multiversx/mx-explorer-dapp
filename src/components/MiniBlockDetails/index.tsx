import * as React from 'react';
import { useGlobalState } from 'context';
import { isHash, networkRoute, urlBuilder } from 'helpers';
import { Redirect, useParams } from 'react-router-dom';
import {
  Loader,
  ShardSpan,
  NetworkLink,
  TransactionsTable,
  adapter,
  DetailItem,
  Trim,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import { initialState } from 'sharedComponents/Adapter/functions/getMiniBlocks';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
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
  const ref = React.useRef(null);

  const { getMiniBlockTransactions, getMiniBlockTransactionsCount, getMiniBlock } = adapter();

  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();

  const [state, setState] = React.useState<StateType>(initialState);
  const [miniBlockFetched, setMiniBlockFetched] = React.useState<boolean | undefined>();

  const { miniBlock } = state;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const size = parseInt(page!) ? parseInt(page!) : 1;

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const fetchMiniBlockData = () => {
    if (!invalid) {
      Promise.all([
        getMiniBlock({ miniBlockHash }),
        getMiniBlockTransactions({
          size,
          miniBlockHash,
        }),
      ]).then(([miniBlockData, miniBlockTransactionsData]) => {
        if (ref.current !== null) {
          setTransactions(miniBlockTransactionsData.data);
          setTransactionsFetched(miniBlockTransactionsData.success);
          setState(miniBlockData);
          setMiniBlockFetched(miniBlockData.blockFetched);
        }
      });
      getMiniBlockTransactionsCount({
        miniBlockHash,
      }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(count);
        }
      });
    }
  };

  React.useEffect(fetchMiniBlockData, [activeNetworkId, size, miniBlockHash, refreshFirstPage]);

  const showTransactions = transactionsFetched === true && transactions.length > 0;

  return invalid ? (
    <Redirect to={networkRoute({ to: `/not-found`, activeNetworkId })} />
  ) : (
    <>
      {miniBlockFetched === undefined && <Loader />}
      {miniBlockFetched === false && <MiniBlockNotFound miniBlockHash={miniBlockHash} />}

      <div ref={ref}>
        {miniBlockFetched && miniBlock.miniBlockHash && (
          <div className="container py-spacer">
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title" data-testid="pageTitle">
                  Miniblock Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body p-0">
                        <div className="container-fluid">
                          <DetailItem title="Miniblock Hash">
                            <Trim text={miniBlockHash} />
                          </DetailItem>
                          <DetailItem title="Sender Shard">
                            <NetworkLink to={urlBuilder.shard(miniBlock.senderShard)}>
                              <ShardSpan shardId={miniBlock.senderShard} />
                            </NetworkLink>
                          </DetailItem>

                          <DetailItem title="Receiver Shard">
                            <NetworkLink to={urlBuilder.shard(miniBlock.receiverShard)}>
                              <ShardSpan shardId={miniBlock.receiverShard} />
                            </NetworkLink>
                          </DetailItem>

                          <DetailItem title="Sender Block">
                            {miniBlock.senderBlockHash !== '' ? (
                              <NetworkLink
                                className="trim-wrapper"
                                to={`/blocks/${miniBlock.senderBlockHash}`}
                              >
                                <Trim text={miniBlock.senderBlockHash} />
                              </NetworkLink>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </DetailItem>

                          <DetailItem title="Receiver Block">
                            {miniBlock.receiverBlockHash !== '' ? (
                              <NetworkLink
                                className="trim-wrapper"
                                to={`/blocks/${miniBlock.receiverBlockHash}`}
                              >
                                <Trim text={miniBlock.receiverBlockHash} />
                              </NetworkLink>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </DetailItem>

                          <DetailItem title="Type">{miniBlock.type}</DetailItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 mt-spacer">
                    {showTransactions ? (
                      <TransactionsTable
                        transactions={transactions}
                        addressId={undefined}
                        totalTransactions={totalTransactions}
                        size={size}
                        withTitle={true}
                      />
                    ) : (
                      <div className="card">
                        {transactionsFetched === undefined && <Loader />}
                        {transactionsFetched === false && <FailedTransactions />}
                        {transactionsFetched === true && transactions.length === 0 && (
                          <NoTransactions />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniBlockDetails;
