import * as React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { Tab, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
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
  dateFormatted,
  urlBuilder,
  isContract,
  getTransactionMethod
} from 'helpers';
import { useNetworkRoute } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { transactionsRoutes } from 'routes';
import {
  TransactionType,
  TxActionCategoryEnum,
  VisibleTransactionOperationType,
  ResultType
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
      Object.values<string>(VisibleTransactionOperationType).includes(
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

export const ScrDetailItem = ({ result }: { result: ResultType }) => (
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
        <div className='card-header'>
          <div className='card-header-item d-flex align-items-center'>
            <div className='tab-links d-flex flex-row flex-wrap'>
              <Nav.Link
                data-testid='title'
                eventKey='details'
                className={`tab-link me-3 me-lg-4 ${
                  activeKey === 'details' ? 'active' : ''
                }`}
                onClick={() => {
                  window.history.replaceState(
                    null,
                    '',
                    urlBuilder.transactionDetails(transaction.txHash)
                  );
                }}
              >
                <h5>Transaction Details</h5>
              </Nav.Link>

              <Nav.Link
                eventKey='logs'
                className={`tab-link me-3 me-lg-4 ${
                  activeKey === 'logs' ? 'active' : ''
                }`}
                onClick={() => {
                  window.history.replaceState(
                    null,
                    '',
                    urlBuilder.transactionDetailsLogs(transaction.txHash)
                  );
                }}
              >
                <h5>Logs</h5>
              </Nav.Link>
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
            <Tab.Pane eventKey='details'>det</Tab.Pane>

            <Tab.Pane eventKey='logs'>logs</Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  );
};
