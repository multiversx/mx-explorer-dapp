import * as React from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons/faSpinner';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import {
  addressIsBech32,
  dateFormatted,
  urlBuilder,
  useNetworkRoute,
  isContract,
  getTransactionMethod,
  getOperationsMessages,
  getScResultsMessages,
} from 'helpers';
import {
  TransactionType,
  TransactionTokensType,
  TxActionCategoryEnum,
  VisibleTransactionOperationType,
} from 'helpers/types';
import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
  TransactionAction,
  LoadingDots,
} from 'sharedComponents';
import { getStatusIconAndColor } from 'sharedComponents/TransactionStatus';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import EventsList from '../EventsList';
import OperationsList from '../OperationsList';
import ScResultsList from '../ScResultsList';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { useGlobalState } from 'context';
import { transactionsRoutes } from 'routes';
import DataField from './DataField';

const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();

  return output;
};

const getVisibleOperations = (transaction: TransactionType) => {
  const operations =
    transaction?.operations?.filter((operation): operation is any =>
      Object.values<string>(VisibleTransactionOperationType).includes(operation.type)
    ) ?? [];

  return operations;
};

const TransactionInfo = ({
  transaction,
  transactionTokens,
}: {
  transaction: TransactionType;
  transactionTokens?: TransactionTokensType;
}) => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const networkRoute = useNetworkRoute();
  const match: any = useRouteMatch(networkRoute(transactionsRoutes.transactionDetails));
  const activeSection = match?.params.tab ? match.params.tab : 'details';
  const [activeKey, setActiveKey] = React.useState(activeSection);

  const isTxPending =
    transaction.status.toLowerCase() === txStatus.pending.toLowerCase() ||
    transaction.pendingResults;

  const formattedUsdValue = (amount: string, usd: number, digits: number) => {
    const sum = (parseFloat(amount) * usd).toFixed(digits);
    const formattedValue = parseFloat(sum).toLocaleString('en', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
    return ` ${parseFloat(amount) > 0 ? '≈' : '='} $${formattedValue}`;
  };

  const transactionMessages = new Set([
    ...getScResultsMessages(transaction),
    ...getOperationsMessages(transaction),
  ]);

  const transactionFee =
    transaction.fee === undefined && transaction.gasUsed === undefined
      ? 'N/A'
      : denominate({
          input: transaction.fee ? transaction.fee : getFee(transaction),
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
        });

  const formattedTxValue = denominate({
    input: transaction.value,
    denomination,
    decimals,
    showLastNonZeroDecimal: true,
  });

  const txValue = denominate({
    input: transaction.value,
    denomination,
    decimals,
    addCommas: false,
    showLastNonZeroDecimal: true,
  });

  const visibleOperations = getVisibleOperations(transaction);

  return (
    <div className="transaction-info card" ref={ref}>
      <Tab.Container
        id="transaction-tabs"
        defaultActiveKey={activeKey}
        onSelect={(selectedKey) => {
          return selectedKey ? setActiveKey(selectedKey) : 'details';
        }}
      >
        <div
          className={`card-header status-${
            getStatusIconAndColor(transaction.status, transaction.pendingResults).color
          }`}
        >
          <div className="card-header-item d-flex align-items-center">
            <Nav.Link
              data-testid="title"
              eventKey="details"
              className={`tab-link mr-3 ${activeKey === 'details' ? 'active' : ''}`}
              onClick={() => {
                window.history.replaceState(
                  null,
                  '',
                  urlBuilder.transactionDetails(transaction.txHash)
                );
              }}
            >
              Transaction Details
            </Nav.Link>
            {transaction.logs && (
              <Nav.Link
                eventKey="logs"
                className={`tab-link mr-3 ${activeKey === 'logs' ? 'active' : ''}`}
                onClick={() => {
                  window.history.replaceState(
                    null,
                    '',
                    urlBuilder.transactionDetailsLogs(transaction.txHash)
                  );
                }}
              >
                Logs
              </Nav.Link>
            )}
            {isTxPending && (
              <div className="d-flex align-items-center ml-auto">
                <LoadingDots />
              </div>
            )}
          </div>
        </div>

        <div className="card-body p-0">
          <div className="container-fluid">
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <DetailItem title="Hash">
                  <div className="d-flex align-items-center text-break-all">
                    {transaction.txHash}
                    <CopyButton text={transaction.txHash} />
                  </div>
                </DetailItem>

                <DetailItem title="Status">
                  <TransactionStatus
                    status={transaction.status}
                    pendingResults={transaction.pendingResults}
                  />
                </DetailItem>

                <DetailItem title="Age">
                  {transaction.timestamp !== undefined ? (
                    <div className="d-flex align-items-center">
                      {isTxPending ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="mr-2 text-secondary fa-spin slow-spin"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                      )}
                      <TimeAgo value={transaction.timestamp} />
                      &nbsp;
                      <span className="text-secondary">
                        ({dateFormatted(transaction.timestamp, false, true)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Miniblock">
                  <div className="d-flex align-items-center">
                    {transaction.miniBlockHash ? (
                      <>
                        <NetworkLink
                          to={`/miniblocks/${transaction.miniBlockHash}`}
                          className="trim-wrapper"
                        >
                          <Trim text={transaction.miniBlockHash} />
                        </NetworkLink>
                        <CopyButton text={transaction.miniBlockHash} />
                      </>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </div>
                </DetailItem>

                <DetailItem title="From">
                  <div className="d-flex align-items-center">
                    <ScAddressIcon initiator={transaction.sender} />
                    {addressIsBech32(transaction.sender) ? (
                      <>
                        <NetworkLink
                          to={urlBuilder.accountDetails(transaction.sender)}
                          className="trim-wrapper"
                        >
                          <Trim text={transaction.sender} />
                        </NetworkLink>
                        <CopyButton className="mr-2" text={transaction.sender} />
                        <NetworkLink
                          to={urlBuilder.senderShard(transaction.senderShard)}
                          className="flex-shrink-0"
                        >
                          (<ShardSpan shard={transaction.senderShard} />)
                        </NetworkLink>
                      </>
                    ) : (
                      <ShardSpan shard={transaction.sender} />
                    )}
                  </div>
                </DetailItem>

                <DetailItem title="To">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center">
                      {isContract(transaction.receiver) ? (
                        <span className="mr-2">Contract</span>
                      ) : (
                        ''
                      )}
                      <NetworkLink
                        to={urlBuilder.accountDetails(transaction.receiver)}
                        className="trim-wrapper"
                      >
                        <Trim text={transaction.receiver} />
                      </NetworkLink>
                      <CopyButton className="mr-2" text={transaction.receiver} />
                      {!isNaN(transaction.receiverShard) && (
                        <NetworkLink
                          to={urlBuilder.receiverShard(transaction.receiverShard)}
                          className="flex-shrink-0"
                        >
                          (<ShardSpan shard={transaction.receiverShard} />)
                        </NetworkLink>
                      )}
                    </div>
                    {Array.from(transactionMessages).map((msg, i) => (
                      <div key={i} className="d-flex ml-1 text-break-all">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="text-secondary"
                          style={{ marginTop: '2px' }}
                          transform={{ rotate: 45 }}
                        />
                        &nbsp;
                        <small className="text-danger ml-1"> {msg}</small>
                      </div>
                    ))}
                    {transaction.status === txStatus.rewardReverted && (
                      <div className="d-flex ml-1 text-break-all">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="text-secondary"
                          style={{ marginTop: '2px' }}
                          transform={{ rotate: 45 }}
                        />
                        &nbsp;
                        <small className="text-danger ml-1"> Block Reverted</small>
                      </div>
                    )}
                  </div>
                </DetailItem>

                <DetailItem title="Value">
                  {formattedTxValue} {erdLabel}{' '}
                  <span className="text-secondary">
                    {transaction.price !== undefined ? (
                      <>({formattedUsdValue(txValue, transaction.price, 2)})</>
                    ) : (
                      <>N/A</>
                    )}
                  </span>
                </DetailItem>

                {transaction.action && transaction.action.category && (
                  <>
                    <DetailItem title="Method">{getTransactionMethod(transaction)}</DetailItem>
                    {transaction.action.category !== TxActionCategoryEnum.scCall && (
                      <DetailItem title="Transaction Action">
                        <TransactionAction transaction={transaction} />
                      </DetailItem>
                    )}
                  </>
                )}

                {Boolean(visibleOperations.length) && (
                  <DetailItem
                    title={
                      <>
                        <span className="mr-2">Token Operations</span>
                        <span className="badge badge-secondary badge-pill font-weight-light">
                          {visibleOperations.length}
                        </span>
                      </>
                    }
                  >
                    <OperationsList
                      operations={visibleOperations}
                      transactionTokens={transactionTokens}
                    />
                  </DetailItem>
                )}

                <DetailItem title="Transaction Fee">
                  {transaction.gasUsed !== undefined ? (
                    <>
                      {transactionFee} {erdLabel}{' '}
                      <span className="text-secondary">
                        {transaction.price !== undefined ? (
                          <>({formattedUsdValue(transactionFee, transaction.price, 4)})</>
                        ) : (
                          <>N/A</>
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="EGLD Price">
                  {transaction.price !== undefined ? (
                    <>
                      {`$${Number(transaction.price).toLocaleString('en', {
                        minimumFractionDigits: 2,
                      })}`}
                    </>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Gas Limit">
                  {transaction.gasLimit !== undefined ? (
                    <>{transaction.gasLimit.toLocaleString('en')}</>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Gas Used">
                  {transaction.gasUsed !== undefined ? (
                    <>{transaction.gasUsed.toLocaleString('en')}</>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Gas Price">
                  {transaction.gasPrice !== undefined ? (
                    <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Nonce">{transaction.nonce}</DetailItem>

                <DataField data={transaction.data} scamInfo={transaction.scamInfo} />

                {transaction.results && transaction.results?.length > 0 && (
                  <DetailItem title="Smart&nbsp;Contract Results">
                    <ScResultsList
                      results={transaction.results}
                      transactionTokens={transactionTokens}
                    />
                  </DetailItem>
                )}
              </Tab.Pane>

              {transaction.logs && (
                <Tab.Pane eventKey="logs">
                  {transaction.logs.address !== undefined && (
                    <DetailItem title="Address">
                      <div className="d-flex align-items-center">
                        <ScAddressIcon initiator={transaction.logs.address} />
                        {addressIsBech32(transaction.logs.address) ? (
                          <>
                            <NetworkLink
                              to={urlBuilder.accountDetails(transaction.logs.address)}
                              className="trim-wrapper"
                            >
                              <Trim text={transaction.logs.address} />
                            </NetworkLink>
                            <CopyButton className="mr-2" text={transaction.logs.address} />
                          </>
                        ) : null}
                      </div>
                    </DetailItem>
                  )}
                  {transaction.logs.events && transaction.logs.events?.length > 0 && (
                    <DetailItem title="Events">
                      <EventsList events={transaction.logs.events} />
                    </DetailItem>
                  )}
                </Tab.Pane>
              )}
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
};

export default TransactionInfo;
