import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Loader,
  ShardSpan,
  NetworkLink,
  TransactionsTable,
  useAdapter,
  DetailItem,
  Trim,
  CopyButton
} from 'components';
import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { NoScResults } from 'components/ScResultsTable/NoScResults';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { NoTransactions } from 'components/TransactionsTable/NoTransactions';
import { isHash, urlBuilder } from 'helpers';
import { useNetworkRoute, useSize, useURLSearchParams } from 'hooks';

import { activeNetworkSelector } from 'redux/selectors';
import { UITransactionType, TxFiltersEnum } from 'types';
import { MiniBlockNotFound } from './MiniBlockNotFound';

interface MiniBlockType {
  senderShard: number;
  receiverShard: number;
  senderBlockHash: string;
  receiverBlockHash: string;
  type: string;
  miniBlockHash: string;
}

export const MiniBlockDetails = () => {
  const { hash: miniBlockHash } = useParams() as any;
  const { size } = useSize();

  const ref = React.useRef(null);
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();

  const {
    senderShard,
    receiverShard,
    sender,
    receiver,
    method,
    before,
    after,
    status,
    search
  } = useURLSearchParams();

  const { getTransfers, getTransfersCount, getMiniBlock } = useAdapter();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [miniBlock, setMiniBlock] = React.useState<MiniBlockType>();
  const [miniBlockFetched, setMiniBlockFetched] = React.useState<
    boolean | undefined
  >();

  const [transactions, setTransactions] = React.useState<UITransactionType[]>(
    []
  );
  const [transactionsFetched, setTransactionsFetched] = React.useState<
    boolean | undefined
  >();
  const [totalTransactions, setTotalTransactions] = React.useState<
    number | '...'
  >('...');

  const invalid = miniBlockHash && !isHash(miniBlockHash);
  const isScResult =
    miniBlockFetched &&
    miniBlock &&
    miniBlock.type === 'SmartContractResultBlock';
  const showTransactions =
    transactionsFetched === true && transactions.length > 0;

  const fetchMiniBlockData = () => {
    if (!invalid) {
      Promise.all([
        getMiniBlock(miniBlockHash),
        getTransfers({
          size,
          miniBlockHash,
          senderShard,
          receiverShard,
          sender,
          receiver,
          method,
          before,
          after,
          status,
          search,
          withUsername: true
        }),
        getTransfersCount({
          size,
          miniBlockHash,
          senderShard,
          receiverShard,
          sender,
          receiver,
          method,
          before,
          after,
          status,
          search
        })
      ]).then(
        ([
          miniBlockData,
          miniBlockTransactionsData,
          miniBlockTransactionsCount
        ]) => {
          if (ref.current !== null) {
            if (miniBlockTransactionsData.success) {
              setTransactions(miniBlockTransactionsData.data);
            }
            setTransactionsFetched(miniBlockTransactionsData.success);
            if (miniBlockData.success) {
              setMiniBlock(miniBlockData.data);
            }
            setMiniBlockFetched(miniBlockData.success);
            if (miniBlockTransactionsCount.success) {
              setTotalTransactions(miniBlockTransactionsCount.data);
            }
          }
        }
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMiniBlockData, [
    activeNetworkId,
    size,
    miniBlockHash,
    searchParams
  ]);

  return invalid ? (
    navigate(networkRoute('/not-found'))
  ) : (
    <>
      {miniBlockFetched === undefined && <Loader />}
      {miniBlockFetched === false && (
        <MiniBlockNotFound miniBlockHash={miniBlockHash} />
      )}

      <div ref={ref}>
        {miniBlockFetched && miniBlock && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='row'>
                  <div className='col-12'>
                    <div className='card'>
                      <div className='card-header'>
                        <div className='card-header-item'>
                          <h5
                            data-testid='pageTitle'
                            className='mb-0 d-flex align-items-center'
                          >
                            Miniblock Details
                          </h5>
                        </div>
                      </div>

                      <div className='card-body'>
                        <div className='container-fluid'>
                          <DetailItem title='Miniblock Hash'>
                            <div className='d-flex align-items-center text-break-all'>
                              {miniBlockHash}
                              <CopyButton text={miniBlockHash} />
                            </div>
                          </DetailItem>
                          <DetailItem title='Sender Shard'>
                            <div className='d-flex'>
                              <NetworkLink
                                to={urlBuilder.shard(miniBlock.senderShard)}
                              >
                                <ShardSpan shard={miniBlock.senderShard} />
                              </NetworkLink>
                            </div>
                          </DetailItem>

                          <DetailItem title='Receiver Shard'>
                            <div className='d-flex'>
                              <NetworkLink
                                to={urlBuilder.shard(miniBlock.receiverShard)}
                              >
                                <ShardSpan shard={miniBlock.receiverShard} />
                              </NetworkLink>
                            </div>
                          </DetailItem>

                          <DetailItem title='Sender Block'>
                            <div className='d-flex align-items-center'>
                              {miniBlock.senderBlockHash !== '' ? (
                                <NetworkLink
                                  className='trim-wrapper'
                                  to={`/blocks/${miniBlock.senderBlockHash}`}
                                >
                                  <Trim text={miniBlock.senderBlockHash} />
                                </NetworkLink>
                              ) : (
                                <span className='text-neutral-400'>N/A</span>
                              )}
                            </div>
                          </DetailItem>

                          <DetailItem title='Receiver Block'>
                            <div className='d-flex align-items-center'>
                              {miniBlock.receiverBlockHash !== '' ? (
                                <NetworkLink
                                  className='trim-wrapper'
                                  to={`/blocks/${miniBlock.receiverBlockHash}`}
                                >
                                  <Trim text={miniBlock.receiverBlockHash} />
                                </NetworkLink>
                              ) : (
                                <span className='text-neutral-400'>N/A</span>
                              )}
                            </div>
                          </DetailItem>

                          <DetailItem title='Type'>{miniBlock.type}</DetailItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 mt-spacer'>
                    {transactionsFetched === undefined ? (
                      <Loader />
                    ) : (
                      <>
                        {showTransactions ? (
                          <TransactionsTable
                            transactions={transactions}
                            address={undefined}
                            totalTransactions={totalTransactions}
                            size={size}
                            title={
                              <h5
                                data-testid='title'
                                className='mb-0 d-flex align-items-center'
                              >
                                {isScResult ? 'SC Results' : 'Transactions'}
                              </h5>
                            }
                            inactiveFilters={[TxFiltersEnum.miniBlockHash]}
                          />
                        ) : (
                          <div className='card'>
                            {transactionsFetched === false &&
                              (isScResult ? (
                                <FailedScResults />
                              ) : (
                                <FailedTransactions />
                              ))}
                            {transactionsFetched === true &&
                              transactions.length === 0 &&
                              (isScResult ? (
                                <NoScResults />
                              ) : (
                                <NoTransactions />
                              ))}
                          </div>
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
