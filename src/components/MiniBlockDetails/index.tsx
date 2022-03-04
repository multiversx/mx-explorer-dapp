import * as React from 'react';
import { useGlobalState } from 'context';
import { isHash, useNetworkRoute, urlBuilder, useSize } from 'helpers';
import { ScResultType } from 'helpers/types';
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
  ScResultsTable,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import NoScResults from 'sharedComponents/ScResultsTable/NoScResults';
import FailedScResults from 'sharedComponents/ScResultsTable/FailedScResults';
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
  const { hash: miniBlockHash } = useParams() as any;
  const { size } = useSize();

  const ref = React.useRef(null);
  const networkRoute = useNetworkRoute();

  const {
    getMiniBlockTransactions,
    getMiniBlockTransactionsCount,
    getMiniBlock,
    getMiniBlockScResults,
  } = adapter();

  const { activeNetworkId } = useGlobalState();

  const [miniBlock, setMiniBlock] = React.useState<MiniBlockType>();
  const [miniBlockFetched, setMiniBlockFetched] = React.useState<boolean | undefined>();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const [scResults, setScResults] = React.useState<ScResultType[]>([]);
  const [scResultsFetched, setScResultsFetched] = React.useState<boolean | undefined>();

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const isScResult = miniBlockFetched && miniBlock && miniBlock.type === 'SmartContractResultBlock';

  const showTransactions = transactionsFetched === true && transactions.length > 0 && !isScResult;
  const showScResults = scResultsFetched === true && scResults.length > 0 && isScResult;

  const fetchScResultData = () => {
    if (!invalid) {
      getMiniBlockScResults({
        size,
        miniBlockHash,
      }).then((miniBlockScResultsData) => {
        if (ref.current !== null) {
          if (miniBlockScResultsData.success) {
            setScResults(miniBlockScResultsData.data);
          }
          setScResultsFetched(miniBlockScResultsData.success);
        }
      });
    }
  };

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMiniBlockData, [activeNetworkId, size, miniBlockHash]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchScResultData, [isScResult]);

  return invalid ? (
    <Redirect to={networkRoute(`/not-found`)} />
  ) : (
    <>
      {miniBlockFetched === undefined && <Loader />}
      {miniBlockFetched === false && <MiniBlockNotFound miniBlockHash={miniBlockHash} />}

      <div ref={ref}>
        {miniBlockFetched && miniBlock && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-header-item">
                          <h6 data-testid="pageTitle">Miniblock Details</h6>
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
                    {transactionsFetched === undefined ||
                    (isScResult && scResultsFetched === undefined) ? (
                      <Loader />
                    ) : (
                      <>
                        {isScResult ? (
                          <>
                            {showScResults ? (
                              <ScResultsTable
                                scResults={scResults}
                                address={undefined}
                                totalScResults={scResults.length}
                                size={size}
                              />
                            ) : (
                              <div className="card">
                                {scResultsFetched === false && <FailedScResults />}
                                {scResultsFetched === true && scResults.length === 0 && (
                                  <NoScResults />
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {showTransactions ? (
                              <TransactionsTable
                                transactions={transactions}
                                address={undefined}
                                totalTransactions={totalTransactions}
                                size={size}
                              />
                            ) : (
                              <div className="card">
                                {transactionsFetched === false && <FailedTransactions />}
                                {transactionsFetched === true && transactions.length === 0 && (
                                  <NoTransactions />
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
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
