import * as React from 'react';
import {
  faAngleDown,
  faClock,
  faSearch,
  faSpinner
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { Tab, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';

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
  FormatUSD
} from 'components';
import { denominate } from 'components/Denominate/denominate';
import { getStatusIconAndColor } from 'components/TransactionStatus';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { DECIMALS, DIGITS } from 'config';
import {
  addressIsBech32,
  formatDate,
  urlBuilder,
  isContract,
  getTransactionMethod
} from 'helpers';
import { useNetworkRoute } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { transactionsRoutes } from 'routes';
import {
  TransactionType,
  TransactionActionCategoryEnum,
  TransactionVisibleOperationEnum,
  TransactionSCResultType
} from 'types';

import { DataField } from './DataField';
import { NonceMessage } from './NonceMessage';
import { TransactionErrorDisplay } from './TransactionErrorDisplay';
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
      <ScAddressIcon initiator={address} />
      {addressIsBech32(address) ? (
        <>
          <NetworkLink
            to={urlBuilder.accountDetails(address)}
            className='trim-wrapper'
          >
            <Trim text={address} />
          </NetworkLink>
          <CopyButton className='me-2' text={address} />
        </>
      ) : null}
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
  const ref = React.useRef(null);

  const { egldLabel } = useSelector(activeNetworkSelector);

  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const match: any = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsLogs)
  );

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
          denomination: DECIMALS,
          decimals: DIGITS,
          showLastNonZeroDecimal: true
        });

  const formattedTxValue = denominate({
    input: transaction.value,
    denomination: DECIMALS,
    decimals: DIGITS,
    showLastNonZeroDecimal: true
  });

  const txValue = denominate({
    input: transaction.value,
    denomination: DECIMALS,
    decimals: DIGITS,
    addCommas: false,
    showLastNonZeroDecimal: true
  });

  const visibleOperations = getVisibleOperations(transaction);
  const showLogs =
    transaction.logs || (transaction.results && transaction.results.length > 0);

  return (
    <div className='transaction-info card' ref={ref}>
      <Tab.Container
        id='transaction-tabs'
        defaultActiveKey={activeKey}
        onSelect={(selectedKey) => {
          return selectedKey ? setActiveKey(selectedKey) : 'details';
        }}
      >
        <div
          className={`card-header status-${
            getStatusIconAndColor(
              transaction.status,
              transaction.pendingResults
            ).color
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
                      pathname: urlBuilder.transactionDetails(
                        transaction.txHash
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
                        pathname: urlBuilder.transactionDetailsLogs(
                          transaction.txHash
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
                  {transaction.txHash}
                  <CopyButton text={transaction.txHash} />
                </div>
              </DetailItem>

              <DetailItem title='Status'>
                <div className='d-flex flex-wrap align-items-center'>
                  <TransactionStatus
                    status={transaction.status}
                    pendingResults={transaction.pendingResults}
                  />
                </div>
              </DetailItem>

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
                  <ScAddressIcon initiator={transaction.sender} />
                  {addressIsBech32(transaction.sender) ? (
                    <>
                      <NetworkLink
                        to={urlBuilder.accountDetails(transaction.sender)}
                        className='trim-wrapper'
                      >
                        <AccountName
                          address={transaction.sender}
                          assets={transaction.senderAssets}
                        />
                      </NetworkLink>
                      <CopyButton className='me-2' text={transaction.sender} />
                      <NetworkLink
                        to={urlBuilder.senderShard(transaction.senderShard)}
                        className='flex-shrink-0'
                      >
                        (<ShardSpan shard={transaction.senderShard} />)
                      </NetworkLink>
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
                    <NetworkLink
                      to={urlBuilder.accountDetails(transaction.receiver)}
                      className='trim-wrapper'
                    >
                      <AccountName
                        address={transaction.receiver}
                        assets={transaction.receiverAssets}
                      />
                    </NetworkLink>
                    <CopyButton className='me-2' text={transaction.receiver} />
                    {!isNaN(transaction.receiverShard) && (
                      <NetworkLink
                        to={urlBuilder.receiverShard(transaction.receiverShard)}
                        className='flex-shrink-0'
                      >
                        (<ShardSpan shard={transaction.receiverShard} />)
                      </NetworkLink>
                    )}
                  </div>
                  <TransactionErrorDisplay transaction={transaction} />
                  {transaction.status === txStatus.rewardReverted && (
                    <div className='d-flex ms-1 text-break-all'>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{ marginTop: '2px' }}
                        transform={{ rotate: 45 }}
                      />
                      &nbsp;
                      <small className='text-danger ms-1'>
                        {' '}
                        Block Reverted
                      </small>
                    </div>
                  )}
                </div>
              </DetailItem>

              <DetailItem title='Value' className='text-neutral-100'>
                {formattedTxValue} {egldLabel}{' '}
                <span className='text-neutral-400'>
                  {transaction.price !== undefined ? (
                    <FormatUSD
                      amount={txValue}
                      usd={transaction.price}
                      digits={2}
                    />
                  ) : (
                    <>N/A</>
                  )}
                </span>
              </DetailItem>

              {transaction.action && transaction.action.category && (
                <>
                  <DetailItem title='Method'>
                    <div className='badge badge-outline badge-outline-green-alt'>
                      {getTransactionMethod(transaction)}
                    </div>
                  </DetailItem>
                  {transaction.action.category !==
                    TransactionActionCategoryEnum.scCall && (
                    <DetailItem
                      title='Transaction Action'
                      className='text-lh-24'
                    >
                      <TransactionAction transaction={transaction} />
                    </DetailItem>
                  )}
                </>
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

              <DetailItem title='Transaction Fee'>
                {transaction.gasUsed !== undefined ? (
                  <>
                    <span className='text-neutral-100'>{transactionFee}</span>{' '}
                    {egldLabel}{' '}
                    <span className='text-neutral-400'>
                      {transaction.price !== undefined ? (
                        <FormatUSD
                          amount={transactionFee}
                          usd={transaction.price}
                          digits={4}
                        />
                      ) : (
                        <>N/A</>
                      )}
                    </span>
                  </>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title={`${egldLabel} Price`}>
                {transaction.price !== undefined ? (
                  <span className='text-neutral-100'>{`$${new BigNumber(
                    transaction.price
                  ).toFormat(2)}`}</span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Gas Limit'>
                {transaction.gasLimit !== undefined ? (
                  <span className='text-neutral-100'>
                    {transaction.gasLimit.toLocaleString('en')}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Gas Used'>
                {transaction.gasUsed !== undefined ? (
                  <span className='text-neutral-100'>
                    {transaction.gasUsed.toLocaleString('en')}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Gas Price'>
                {transaction.gasPrice !== undefined ? (
                  <span className='text-neutral-100'>
                    <Denominate
                      value={transaction.gasPrice.toString()}
                      showLastNonZeroDecimal
                    />
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>

              <DetailItem title='Nonce'>
                <>
                  <span className='text-neutral-100'>{transaction.nonce}</span>
                  <NonceMessage transaction={transaction} />
                </>
              </DetailItem>

              <DataField
                data={transaction.data}
                scamInfo={transaction.scamInfo}
              />

              {transaction.results && transaction.results?.length > 0 && (
                <DetailItem title='Smart&nbsp;Contract Results'>
                  <ScResultsList results={transaction.results} />
                </DetailItem>
              )}
            </Tab.Pane>

            {showLogs && (
              <Tab.Pane eventKey='logs'>
                {transaction.logs && (
                  <>
                    {' '}
                    {transaction.logs.address !== undefined && (
                      <AddressDetailItem address={transaction.logs.address} />
                    )}
                    {transaction.logs.events &&
                      transaction.logs.events?.length > 0 && (
                        <DetailItem title='Events'>
                          <EventsList
                            events={transaction.logs.events}
                            id={transaction.logs?.id}
                          />
                        </DetailItem>
                      )}
                  </>
                )}
                {transaction.results && transaction.results.length > 0 && (
                  <div className='row'>
                    {transaction.results.map((result, resultIndex) =>
                      result.logs ? (
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
                              <DetailItem title='Events'>
                                <EventsList
                                  events={result.logs.events}
                                  id={result.logs?.id}
                                />
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
      </Tab.Container>
    </div>
  );
};
