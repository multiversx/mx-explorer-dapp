import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { Tab, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';

import {
  FormatAmount,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
  TransactionAction,
  LoadingDots,
  FormatUSD,
  TransactionGuardianIcon,
  TransactionSovereignBridgeIcon,
  AccountLink,
  ShardLink
} from 'components';
import {
  addressIsBech32,
  formatAmount,
  formatDate,
  urlBuilder,
  isContract,
  getTransactionMethod,
  getTransactionStatusIconAndColor,
  getTotalTxTokenUsdValue,
  getDisplayReceiver
} from 'helpers';
import { useNetworkRoute } from 'hooks';
import { faClock, faSearch, faSpinner } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';
import { transactionsRoutes } from 'routes';
import {
  TransactionType,
  TransactionActionCategoryEnum,
  TransactionVisibleOperationEnum,
  TransactionSCResultType,
  TransactionApiStatusEnum
} from 'types';

import { DataField } from './DataField';
import { TransactionErrorDisplay } from './TransactionErrorDisplay';
import { TransactionWarningMessage } from './TransactionWarningMessage';
import { EventsList } from '../EventsList';
import { OperationsList } from '../OperationsList';
import { ScResultsList } from '../ScResultsList';

export const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();

  return output;
};

export const getVisibleOperations = (transaction: TransactionType) => {
  const operations =
    transaction?.operations?.filter((operation): operation is any =>
      Object.values<string>(TransactionVisibleOperationEnum).includes(
        operation.type
      )
    ) ?? [];

  return operations;
};

export const AddressDetailItem = ({ address }: { address: string }) => (
  <DetailItem title='Address' noBorder>
    <div className='d-flex align-items-center'>
      <AccountLink address={address} />
      <CopyButton text={address} />
    </div>
  </DetailItem>
);

export const ScrDetailItem = ({
  result
}: {
  result: TransactionSCResultType;
}) => (
  <DetailItem title='SC Result Hash' noBorder>
    <div className='d-flex align-items-center'>
      <Trim text={result.hash} />
      <CopyButton className='ms-2' text={result.hash} />
      <NetworkLink
        to={`${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}`}
        className='side-action ms-2'
      >
        <FontAwesomeIcon icon={faSearch} />
      </NetworkLink>
    </div>
  </DetailItem>
);

export const TransactionInfo = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const ref = useRef(null);

  const { egldLabel } = useSelector(activeNetworkSelector);

  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const match: any = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsLogs)
  );

  const activeSection = match ? 'logs' : 'details';
  const [activeKey, setActiveKey] = useState(activeSection);

  const { receiver, receiverAssets } = getDisplayReceiver(transaction);

  const isTxPending =
    (transaction?.status &&
      transaction.status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  const transactionFee =
    transaction.fee === undefined && transaction.gasUsed === undefined
      ? 'N/A'
      : formatAmount({
          input: transaction.fee ? transaction.fee : getFee(transaction),
          showLastNonZeroDecimal: true
        });

  const txValue = formatAmount({
    input: transaction.value,
    showLastNonZeroDecimal: true
  });

  const visibleOperations = getVisibleOperations(transaction);
  const hasTxResultsLogs =
    transaction.results &&
    transaction.results.length > 0 &&
    transaction.results.some((ressult) => ressult.logs);
  const showLogs = transaction.logs || hasTxResultsLogs;

  const totalTxTokenUsdValue = getTotalTxTokenUsdValue(transaction);
  const showTotalTxTokenUsdValue =
    totalTxTokenUsdValue !== new BigNumber(0).toString();

  useEffect(() => {
    setActiveKey(activeSection);
  }, [activeSection]);

  return (
    <div className='transaction-info card' ref={ref}>
      <Tab.Container
        id='transaction-tabs'
        defaultActiveKey={activeKey}
        activeKey={activeKey}
        onSelect={(selectedKey) => {
          return selectedKey ? setActiveKey(selectedKey) : 'details';
        }}
      >
        <div
          className={`card-header status-${
            getTransactionStatusIconAndColor({ transaction }).color
          }`}
        >
          <div className='card-header-item d-flex align-items-center'>
            <div className='tab-links d-flex flex-row flex-wrap'>
              <div className='tabs'>
                <Nav.Link
                  data-testid='title'
                  eventKey='details'
                  className={`tab ${activeKey === 'details' ? 'active' : ''}`}
                  onClick={() => {
                    const options = {
                      pathname: networkRoute(
                        urlBuilder.transactionDetails(transaction.txHash)
                      )
                    };
                    navigate(options, { replace: true });
                  }}
                >
                  Transaction Details
                </Nav.Link>
                {showLogs && (
                  <Nav.Link
                    eventKey='logs'
                    className={`tab ${activeKey === 'logs' ? 'active' : ''}`}
                    onClick={() => {
                      const options = {
                        pathname: networkRoute(
                          urlBuilder.transactionDetailsLogs(transaction.txHash)
                        )
                      };
                      navigate(options, { replace: true });
                    }}
                  >
                    Logs
                  </Nav.Link>
                )}
              </div>
            </div>

            {isTxPending && (
              <div className='d-flex align-items-center ms-auto'>
                <LoadingDots />
              </div>
            )}
          </div>
        </div>

        <div className='card-body'>
          <Tab.Content>
            <Tab.Pane eventKey='details'>
              <DetailItem title='Hash'>
                <div className='d-flex align-items-center text-break-all text-neutral-100'>
                  <TransactionGuardianIcon transaction={transaction} />
                  <TransactionSovereignBridgeIcon transaction={transaction} />
                  {transaction.txHash}
                  <CopyButton text={transaction.txHash} />
                </div>
              </DetailItem>

              {transaction?.status && (
                <DetailItem title='Status'>
                  <div className='d-flex flex-wrap align-items-center'>
                    <TransactionStatus transaction={transaction} />
                  </div>
                </DetailItem>
              )}

              <DetailItem title='Age' className='text-neutral-400'>
                {transaction.timestamp !== undefined ? (
                  <div className='d-flex flex-wrap align-items-center'>
                    {isTxPending ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className='me-2  fa-spin slow-spin'
                      />
                    ) : (
                      <FontAwesomeIcon icon={faClock} className='me-2 ' />
                    )}
                    <TimeAgo value={transaction.timestamp} />
                    &nbsp;
                    <span>
                      ({formatDate(transaction.timestamp, false, true)})
                    </span>
                  </div>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Miniblock'>
                <div className='d-flex align-items-center'>
                  {transaction.miniBlockHash ? (
                    <>
                      <NetworkLink
                        to={`/miniblocks/${transaction.miniBlockHash}`}
                        className='trim-wrapper'
                      >
                        <Trim text={transaction.miniBlockHash} />
                      </NetworkLink>
                      <CopyButton text={transaction.miniBlockHash} />
                    </>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </DetailItem>

              <DetailItem title='From'>
                <div className='d-flex align-items-center'>
                  {addressIsBech32(transaction.sender) ? (
                    <>
                      <AccountLink
                        address={transaction.sender}
                        assets={transaction.senderAssets}
                        hasHighlight
                      />
                      <CopyButton className='me-2' text={transaction.sender} />
                      <ShardLink
                        shard={transaction.senderShard}
                        className='flex-shrink-0'
                        transactionSenderShard
                        hasParanthesis
                      />
                    </>
                  ) : (
                    <ShardSpan shard={transaction.sender} />
                  )}
                </div>
              </DetailItem>

              <DetailItem title='To'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center'>
                    {isContract(transaction.receiver) ? (
                      <span className='me-2 text-neutral-400'>Contract</span>
                    ) : (
                      ''
                    )}
                    <AccountLink
                      address={transaction.receiver}
                      assets={transaction.receiverAssets}
                      hasHighlight
                    />
                    <CopyButton className='me-2' text={transaction.receiver} />
                    {!isNaN(transaction.receiverShard) && (
                      <ShardLink
                        shard={transaction.receiverShard}
                        className='flex-shrink-0'
                        transactionReceiverShard
                        hasParanthesis
                      />
                    )}
                  </div>
                  <div className='d-flex flex-column gap-1'>
                    <TransactionErrorDisplay transaction={transaction} />
                  </div>
                </div>
              </DetailItem>

              {receiver !== transaction.receiver && (
                <DetailItem title='Destination'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center'>
                      {isContract(receiver) ? (
                        <span className='me-2 text-neutral-400'>Contract</span>
                      ) : (
                        ''
                      )}
                      <AccountLink
                        address={receiver}
                        assets={receiverAssets}
                        hasHighlight
                      />
                      <CopyButton className='me-2' text={receiver} />
                    </div>
                  </div>
                </DetailItem>
              )}

              <DetailItem title='Value' className='text-neutral-100'>
                <FormatAmount
                  value={transaction.value.toString()}
                  showUsdValue={false}
                  showLastNonZeroDecimal
                />
                {transaction.price !== undefined && (
                  <>
                    {' '}
                    <FormatUSD
                      value={txValue}
                      usd={transaction.price}
                      className='text-neutral-400'
                    />
                  </>
                )}
              </DetailItem>

              <DetailItem title='Method'>
                <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
                  {getTransactionMethod(transaction)}
                </div>
              </DetailItem>

              {transaction?.action?.category &&
                transaction.action.category !==
                  TransactionActionCategoryEnum.scCall && (
                  <DetailItem title='Transaction Action' className='text-lh-24'>
                    <TransactionAction transaction={transaction} />
                  </DetailItem>
                )}

              {Boolean(visibleOperations.length) && (
                <DetailItem
                  title={
                    <>
                      <span className='me-2 text-lh-24'>Token Operations</span>
                      <span className='badge badge-outline badge-outline-grey'>
                        {visibleOperations.length}
                      </span>
                    </>
                  }
                  verticalCenter
                >
                  <OperationsList
                    transaction={transaction}
                    operations={visibleOperations}
                  />
                </DetailItem>
              )}

              {showTotalTxTokenUsdValue && (
                <DetailItem title='Total Token Value'>
                  <span className='text-neutral-100'>
                    <FormatUSD
                      value={totalTxTokenUsdValue}
                      usd={1}
                      digits={4}
                    />
                  </span>
                </DetailItem>
              )}

              <DetailItem title='Transaction Fee' className='text-neutral-100'>
                {transaction.fee !== undefined &&
                transaction.gasUsed !== undefined ? (
                  <>
                    <FormatAmount
                      value={transaction.fee ?? getFee(transaction)}
                      showUsdValue={false}
                      showLastNonZeroDecimal
                    />
                    {transaction.price !== undefined && (
                      <>
                        {' '}
                        <FormatUSD
                          value={transactionFee}
                          usd={transaction.price}
                          className='text-neutral-400'
                        />
                      </>
                    )}
                  </>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              {transaction.price !== undefined && (
                <DetailItem title={`${egldLabel} Price`}>
                  <FormatUSD
                    value={1}
                    usd={transaction.price}
                    showPrefix={false}
                    className='text-neutral-100'
                  />
                </DetailItem>
              )}

              <DetailItem title='Gas Limit'>
                {transaction.gasLimit !== undefined ? (
                  <span className='text-neutral-100'>
                    {new BigNumber(transaction.gasLimit).toFormat()}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Gas Used'>
                {transaction.gasUsed !== undefined ? (
                  <span className='text-neutral-100'>
                    {new BigNumber(transaction.gasUsed).toFormat()}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Gas Price' className='text-neutral-100'>
                {transaction.gasPrice !== undefined ? (
                  <FormatAmount
                    value={transaction.gasPrice.toString()}
                    usd={transaction.price}
                    showLastNonZeroDecimal
                  />
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Nonce'>
                <>
                  <span className='text-neutral-100'>{transaction.nonce}</span>
                  <TransactionWarningMessage transaction={transaction} />
                </>
              </DetailItem>

              <DataField
                data={transaction.data}
                scamInfo={transaction.scamInfo}
              />

              {transaction.results && transaction.results?.length > 0 && (
                <DetailItem
                  title={
                    <div className='item-title'>Smart Contract Results</div>
                  }
                >
                  <ScResultsList results={transaction.results} />
                </DetailItem>
              )}
            </Tab.Pane>

            {showLogs && (
              <Tab.Pane eventKey='logs'>
                {transaction.logs && (
                  <>
                    {transaction.logs.address !== undefined && (
                      <AddressDetailItem address={transaction.logs.address} />
                    )}
                    {transaction.logs.events &&
                      transaction.logs.events.length > 0 && (
                        <DetailItem
                          title={<div className='item-title'>Events</div>}
                        >
                          <EventsList
                            events={transaction.logs.events}
                            txHash={transaction.txHash}
                            id={transaction.logs?.id ?? 'events'}
                          />
                        </DetailItem>
                      )}
                  </>
                )}
                {transaction.results && transaction.results.length > 0 && (
                  <div className='row'>
                    {transaction.results.map((result, resultIndex) => {
                      if (!result.logs) {
                        return null;
                      }

                      return (
                        <div
                          key={`tx-result-log-${resultIndex}`}
                          className='col-12 border-bottom'
                        >
                          <ScrDetailItem result={result} />
                          {result.logs.address !== undefined && (
                            <AddressDetailItem address={result.logs.address} />
                          )}
                          {result.logs.events &&
                            result.logs.events?.length > 0 && (
                              <DetailItem
                                title={<div className='item-title'>Events</div>}
                              >
                                <EventsList
                                  events={result.logs.events}
                                  txHash={transaction.txHash}
                                  id={result.logs?.id ?? 'result-events'}
                                />
                              </DetailItem>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Tab.Pane>
            )}
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  );
};
