import { useGlobalState } from 'context';
import { isHash, networkRoute, urlBuilder } from 'helpers';
import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
  Loader,
  ShardSpan,
  TestnetLink,
  TransactionsTable,
  adapter,
  DetailItem,
} from 'sharedComponents';
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
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
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
      ]).then(([miniBlockData, miniBlocTransactionsData]) => {
        if (ref.current !== null) {
          setTransactions(miniBlocTransactionsData.data);
          setTransactionsFetched(miniBlocTransactionsData.success);
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

  return invalid ? (
    <Redirect to={networkRoute({ to: `/not-found`, activeNetworkId })} />
  ) : (
    <div ref={ref}>
      <div className="container py-spacer">
        <div className="row page-header mb-spacer">
          <div className="col-12">
            <h3 className="page-title">Miniblock Details</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {miniBlockFetched === undefined && <Loader dataTestId="loader" />}
            {miniBlockFetched === false && <MiniBlockNotFound miniBlockHash={miniBlockHash} />}
            {miniBlockFetched && miniBlock.miniBlockHash && (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="card card-small">
                      <div className="card-body p-0">
                        <div className="container-fluid">
                          <DetailItem title="Miniblock Hash">{miniBlockHash}</DetailItem>
                          <DetailItem title="Sender Shard">
                            <TestnetLink to={urlBuilder.shard(miniBlock.senderShard)}>
                              <ShardSpan shardId={miniBlock.senderShard} />
                            </TestnetLink>
                          </DetailItem>

                          <DetailItem title="Receiver Shard">
                            <TestnetLink to={urlBuilder.shard(miniBlock.receiverShard)}>
                              <ShardSpan shardId={miniBlock.receiverShard} />
                            </TestnetLink>
                          </DetailItem>

                          <DetailItem title="Sender Block">
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
                          </DetailItem>

                          <DetailItem title="Receiver Block">
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
                          </DetailItem>

                          <DetailItem title="Type">{miniBlock.type}</DetailItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row page-header my-spacer">
                  <div className="col-12">
                    <h3 className="page-title" data-testid="title">
                      Transactions
                    </h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {transactionsFetched === false && <NoTransactions />}
                    {transactionsFetched === true && (
                      <TransactionsTable
                        transactions={transactions}
                        addressId={undefined}
                        totalTransactions={totalTransactions}
                        size={size}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniBlockDetails;
