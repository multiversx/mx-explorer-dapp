import * as React from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { addressIsBech32, dateFormatted, urlBuilder, useNetworkRoute } from 'helpers';
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
} from 'sharedComponents';
import { getStatusIconAndColor } from 'sharedComponents/TransactionStatus';
import EventsList, { EventType } from '../EventsList';
import OperationsList, { OperationType } from '../OperationsList';
import ScResultsList, { ResultType } from '../ScResultsList';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { useGlobalState } from 'context';
import { transactionsRoutes } from 'routes';
import DataField from './DataField';

export interface TransactionType {
  fee?: string;
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: number;
  txHash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: string;
  timestamp: number;
  value: string;
  price: number;
  results?: ResultType[];
  operations?: OperationType[];
  logs?: {
    address: string;
    events: EventType[];
  };
}

const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();

  return output;
};

const getScResultsMessages = (transaction: TransactionType) => {
  const messages: string[] = [];

  if (transaction.results) {
    transaction.results.forEach((result) => {
      if (result.returnMessage) {
        messages.push(result.returnMessage);
      }
    });
  }

  return messages;
};

const TransactionInfo = ({ transaction }: { transaction: TransactionType }) => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const networkRoute = useNetworkRoute();
  const match: any = useRouteMatch(networkRoute(transactionsRoutes.transactionDetails));
  const activeSection = match?.params.tab ? match.params.tab : 'details';
  const [activeKey, setActiveKey] = React.useState(activeSection);

  const formattedUsdValue = (amount: string, usd: number, digits: number) => {
    const sum = (parseFloat(amount) * usd).toFixed(digits);
    const formattedValue = parseFloat(sum).toLocaleString('en', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
    return ` ${parseFloat(amount) > 0 ? '≈' : '='} $${formattedValue}`;
  };

  const scResultsMessages = getScResultsMessages(transaction);

  const transactionFee =
    transaction.fee === undefined && transaction.gasUsed === undefined
      ? 'N/A'
      : denominate({
          input: transaction.fee ? transaction.fee : getFee(transaction),
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
        });

  const transactionValue = denominate({
    input: transaction.value,
    denomination,
    decimals,
    showLastNonZeroDecimal: true,
  });

  return (
    <div className="transaction-info card" ref={ref}>
      <Tab.Container
        id="transaction-tabs"
        defaultActiveKey={activeKey}
        onSelect={(selectedKey) => {
          return selectedKey ? setActiveKey(selectedKey) : 'details';
        }}
      >
        <div className={`card-header status-${getStatusIconAndColor(transaction.status).color}`}>
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
            {transaction.results && transaction.results?.length > 0 && (
              <Nav.Link
                eventKey="sc-results"
                className={`tab-link mr-3 ${activeKey === 'sc-results' ? 'active' : ''}`}
                onClick={() => {
                  window.history.replaceState(
                    null,
                    '',
                    urlBuilder.transactionDetailsScResults(transaction.txHash)
                  );
                }}
              >
                Smart Contract Results
              </Nav.Link>
            )}
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
          </div>
        </div>

        <div className="card-body p-0">
          <div className="container-fluid">
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <DetailItem title="Hash">
                  <div className="d-flex align-items-center text-break-all">
                    <ScAddressIcon
                      initiator={transaction.sender}
                      secondInitiator={transaction.receiver}
                    />
                    {transaction.txHash}
                    <CopyButton text={transaction.txHash} />
                  </div>
                </DetailItem>

                <DetailItem title="Status">
                  <TransactionStatus status={transaction.status} />
                </DetailItem>

                <DetailItem title="Age">
                  {transaction.timestamp !== undefined ? (
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                      <TimeAgo value={transaction.timestamp} />
                      &nbsp;
                      <span className="text-secondary">
                        ({dateFormatted(transaction.timestamp)})
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
                      <ScAddressIcon initiator={transaction.receiver} />
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
                    {scResultsMessages.map((msg, i) => (
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
                  </div>
                </DetailItem>

                <DetailItem title="Value">
                  {transactionValue} {erdLabel}{' '}
                  <span className="text-secondary">
                    {transaction.price !== undefined ? (
                      <>({formattedUsdValue(transactionValue, transaction.price, 2)})</>
                    ) : (
                      <>N/A</>
                    )}
                  </span>
                </DetailItem>

                {transaction.operations && transaction.operations?.length > 0 && (
                  <DetailItem title="Token Operations">
                    <OperationsList operations={transaction.operations} />
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
                  {transaction.gasUsed ? (
                    <>{transaction.gasUsed.toLocaleString('en')}</>
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Gas Price">
                  {transaction.price !== undefined ? (
                    <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
                  ) : (
                    <span className="text-secondary">N/A</span>
                  )}
                </DetailItem>

                <DetailItem title="Nonce">{transaction.nonce}</DetailItem>

                <DataField data={transaction.data} />
              </Tab.Pane>

              {transaction.results && transaction.results?.length > 0 && (
                <Tab.Pane eventKey="sc-results">
                  <DetailItem title="Smart&nbsp;Contract Results">
                    <ScResultsList results={transaction.results} />
                  </DetailItem>
                </Tab.Pane>
              )}

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
