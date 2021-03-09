import * as React from 'react';
import { useGlobalState } from 'context';
import { isHash, useNetworkRoute, urlBuilder } from 'helpers';
import { Redirect, useParams } from 'react-router-dom';
import {
  Loader,
  ShardSpan,
  NetworkLink,
  TransactionsTable,
  adapter,
  DetailItem,
  Trim,
  CopyButton,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
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

const MiniBlockDetails = () => {
  const { page, hash: miniBlockHash } = useParams() as any;
  const ref = React.useRef(null);
  const networkRoute = useNetworkRoute();

  const { getMiniBlockTransactions, getMiniBlockTransactionsCount, getMiniBlock } = adapter();

  const { activeNetworkId } = useGlobalState();

  const [miniBlock, setMiniBlock] = React.useState<MiniBlockType>();
  const [miniBlockFetched, setMiniBlockFetched] = React.useState<boolean | undefined>();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const size = parseInt(page!) ? parseInt(page!) : 1;

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const fetchMiniBlockData = () => {
    if (!invalid) {
      Promise.all([
        getMiniBlock(miniBlockHash),
        getMiniBlockTransactions({
          size,
          miniBlockHash,
        }),
      ]).then(([miniBlockData, miniBlockTransactionsData]) => {
        if (ref.current !== null) {
          if (miniBlockTransactionsData.success) {
            setTransactions(miniBlockTransactionsData.data);
          }
          setTransactionsFetched(miniBlockTransactionsData.success);
          if (miniBlockData.success) {
            setMiniBlock(miniBlockData.data);
          }
          setMiniBlockFetched(miniBlockData.success);
        }
      });
      getMiniBlockTransactionsCount(miniBlockHash).then(({ data: count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(count);
        }
      });
    }
  };

  React.useEffect(fetchMiniBlockData, [activeNetworkId, size, miniBlockHash]);

  const showTransactions = transactionsFetched === true && transactions.length > 0;

  return invalid ? (
    <Redirect to={networkRoute(`/not-found`)} />
  ) : (
    <>
      {miniBlockFetched === undefined && <Loader />}
      {miniBlockFetched === false && <MiniBlockNotFound miniBlockHash={miniBlockHash} />}

      <div ref={ref}>
        {miniBlockFetched && miniBlock && (
          <div className="container pt-spacer">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-header-item">
                          <h6 data-testid="title">Miniblock Details</h6>
                        </div>
                      </div>

                      <div className="card-body p-0">
                        <div className="container-fluid">
                          <DetailItem title="Miniblock Hash">
                            <div className="d-flex align-items-center text-break-all">
                              {miniBlockHash}
                              <CopyButton text={miniBlockHash} />
                            </div>
                          </DetailItem>
                          <DetailItem title="Sender Shard">
                            <div className="d-flex">
                              <NetworkLink to={urlBuilder.shard(miniBlock.senderShard)}>
                                <ShardSpan shard={miniBlock.senderShard} />
                              </NetworkLink>
                            </div>
                          </DetailItem>

                          <DetailItem title="Receiver Shard">
                            <div className="d-flex">
                              <NetworkLink to={urlBuilder.shard(miniBlock.receiverShard)}>
                                <ShardSpan shard={miniBlock.receiverShard} />
                              </NetworkLink>
                            </div>
                          </DetailItem>

                          <DetailItem title="Sender Block">
                            <div className="d-flex align-items-center">
                              {miniBlock.senderBlockHash !== '' ? (
                                <NetworkLink
                                  className="trim-wrapper"
                                  to={`/blocks/${miniBlock.senderBlockHash}`}
                                >
                                  <Trim text={miniBlock.senderBlockHash} />
                                </NetworkLink>
                              ) : (
                                <span className="text-secondary">N/A</span>
                              )}
                            </div>
                          </DetailItem>

                          <DetailItem title="Receiver Block">
                            <div className="d-flex align-items-center">
                              {miniBlock.receiverBlockHash !== '' ? (
                                <NetworkLink
                                  className="trim-wrapper"
                                  to={`/blocks/${miniBlock.receiverBlockHash}`}
                                >
                                  <Trim text={miniBlock.receiverBlockHash} />
                                </NetworkLink>
                              ) : (
                                <span className="text-secondary">N/A</span>
                              )}
                            </div>
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
                        address={undefined}
                        totalTransactions={totalTransactions}
                        size={size}
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
