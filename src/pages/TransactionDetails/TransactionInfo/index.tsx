import * as React from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useMatch } from 'react-router-dom';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons/faSpinner';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import {
  addressIsBech32,
  dateFormatted,
  urlBuilder,
  useNetworkRoute,
  isContract,
  getTransactionMethod,
  formatUSD,
} from 'helpers';
import {
  TransactionType,
  TxActionCategoryEnum,
  VisibleTransactionOperationType,
  ResultType,
} from 'types';
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
  AccountName,
} from 'components';
import { getStatusIconAndColor } from 'components/TransactionStatus';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { EventsList } from '../EventsList';
import { OperationsList } from '../OperationsList';
import { ScResultsList } from '../ScResultsList';
import { denominate } from 'components/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { useGlobalState } from 'context';
import { transactionsRoutes } from 'routes';
import { DataField } from './DataField';
import { NonceMessage } from './NonceMessage';
import { TransactionErrorDisplay } from './TransactionErrorDisplay';

export const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();

  return output;
};

export const getVisibleOperations = (transaction: TransactionType) => {
  const operations =
    transaction?.operations?.filter((operation): operation is any =>
      Object.values<string>(VisibleTransactionOperationType).includes(operation.type)
    ) ?? [];

  return operations;
};

export const AddressDetailItem = ({ address }: { address: string }) => (
  <DetailItem title="Address" noBorder>
    <div className="d-flex align-items-center">
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <>
          <NetworkLink to={urlBuilder.accountDetails(address)} className="trim-wrapper">
            <Trim text={address} />
          </NetworkLink>
          <CopyButton className="mr-2" text={address} />
        </>
      ) : null}
    </div>
  </DetailItem>
);

export const ScrDetailItem = ({ result }: { result: ResultType }) => (
  <DetailItem title="SC Result Hash" noBorder>
    <div className="d-flex align-items-center">
      <Trim text={result.hash} />
      <CopyButton className="ml-2" text={result.hash} />
      <NetworkLink
        to={`${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}`}
        className="side-action ml-2"
      >
        <FontAwesomeIcon icon={faSearch} />
      </NetworkLink>
    </div>
  </DetailItem>
);

export const TransactionInfo = ({ transaction }: { transaction: TransactionType }) => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const networkRoute = useNetworkRoute();
  const match: any = useMatch(networkRoute(transactionsRoutes.transactionDetailsLogs));

  const activeSection = match ? 'logs' : 'details';
  const [activeKey, setActiveKey] = React.useState(activeSection);

  const isTxPending =
    transaction.status.toLowerCase() === txStatus.pending.toLowerCase() ||
    transaction.pendingResults;

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
  const showLogs = transaction.logs || (transaction.results && transaction.results.length > 0);

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
            {showLogs && (
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
                  <div className="d-flex flex-wrap align-items-center">
                    <TransactionStatus
                      status={transaction.status}
                      pendingResults={transaction.pendingResults}
                    />
                  </div>
                </DetailItem>

                <DetailItem title="Age">
                  {transaction.timestamp !== undefined ? (
                    <div className="d-flex flex-wrap align-items-center">
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
                          <AccountName
                            address={transaction.sender}
                            assets={transaction.senderAssets}
                          />
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
                        <AccountName
                          address={transaction.receiver}
                          assets={transaction.receiverAssets}
                        />
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
                    <TransactionErrorDisplay transaction={transaction} />
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
                      <>
                        (
                        {formatUSD({
                          amount: txValue,
                          usd: transaction.price,
                          digits: 2,
                        })}
                        )
                      </>
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
                        <span className="badge badge-secondary badge-pill font-weight-normal">
                          {visibleOperations.length}
                        </span>
                      </>
                    }
                  >
                    <OperationsList transaction={transaction} operations={visibleOperations} />
                  </DetailItem>
                )}

                <DetailItem title="Transaction Fee">
                  {transaction.gasUsed !== undefined ? (
                    <>
                      {transactionFee} {erdLabel}{' '}
                      <span className="text-secondary">
                        {transaction.price !== undefined ? (
                          <>
                            (
                            {formatUSD({
                              amount: transactionFee,
                              usd: transaction.price,
                              digits: 4,
                            })}
                            )
                          </>
                        ) : (
                          <>N/A</>
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title={`${erdLabel} Price`}>
                  {transaction.price !== undefined ? (
                    <>{`$${new BigNumber(transaction.price).toFormat(2)}`}</>
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

                <DetailItem title="Nonce">
                  <>
                    {transaction.nonce}
                    <NonceMessage transaction={transaction} />
                  </>
                </DetailItem>

                <DataField data={transaction.data} scamInfo={transaction.scamInfo} />

                {transaction.results && transaction.results?.length > 0 && (
                  <DetailItem title="Smart&nbsp;Contract Results">
                    <ScResultsList results={transaction.results} />
                  </DetailItem>
                )}
              </Tab.Pane>

              {showLogs && (
                <Tab.Pane eventKey="logs">
                  {transaction.logs && (
                    <>
                      {' '}
                      {transaction.logs.address !== undefined && (
                        <AddressDetailItem address={transaction.logs.address} />
                      )}
                      {transaction.logs.events && transaction.logs.events?.length > 0 && (
                        <DetailItem title="Events">
                          <EventsList events={transaction.logs.events} id={transaction.logs?.id} />
                        </DetailItem>
                      )}
                    </>
                  )}
                  {transaction.results && transaction.results.length > 0 && (
                    <div className="row">
                      {transaction.results.map((result, resultIndex) =>
                        result.logs ? (
                          <div
                            key={`tx-result-log-${resultIndex}`}
                            className="col-12 border-bottom"
                          >
                            <ScrDetailItem result={result} />
                            {result.logs.address !== undefined && (
                              <AddressDetailItem address={result.logs.address} />
                            )}
                            {result.logs.events && result.logs.events?.length > 0 && (
                              <DetailItem title="Events">
                                <EventsList events={result.logs.events} id={result.logs?.id} />
                              </DetailItem>
                            )}
                          </div>
                        ) : null
                      )}
                    </div>
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