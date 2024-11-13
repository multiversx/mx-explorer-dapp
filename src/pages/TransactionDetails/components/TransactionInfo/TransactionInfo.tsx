import { useEffect, useRef, useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { LoadingDots } from 'components';
import { urlBuilder, getTransactionStatusIconAndColor } from 'helpers';
import { useNetworkRoute } from 'hooks';
import { useGetActiveTransactionSection } from 'pages/TransactionDetails/hooks';
import {
  TransactionType,
  TransactionApiStatusEnum,
  TransactionInfoTabsEnum
} from 'types';

import { InnerTransactionsPanel } from './InnerTransactionsPanel';
import { TransactionDetailsPanel } from './TransactionDetailsPanel';
import { TransactionLogsPanel } from './TransactionLogsPanel';

export const TransactionInfo = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const ref = useRef(null);

  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const activeSection = useGetActiveTransactionSection();
  const [activeKey, setActiveKey] =
    useState<TransactionInfoTabsEnum>(activeSection);

  const isTxPending =
    (transaction?.status &&
      transaction.status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  const hasTxResultsLogs =
    transaction.results &&
    transaction.results.length > 0 &&
    transaction.results.some((ressult) => ressult.logs);
  const showLogs = transaction.logs || hasTxResultsLogs;
  const showInnerTransactions =
    transaction.innerTransactions && transaction.innerTransactions.length > 0;

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
          return selectedKey
            ? setActiveKey(selectedKey as TransactionInfoTabsEnum)
            : TransactionInfoTabsEnum.details;
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
                  eventKey={TransactionInfoTabsEnum.details}
                  className={`tab ${
                    activeKey === TransactionInfoTabsEnum.details
                      ? 'active'
                      : ''
                  }`}
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
                    eventKey={TransactionInfoTabsEnum.logs}
                    className={`tab ${
                      activeKey === TransactionInfoTabsEnum.logs ? 'active' : ''
                    }`}
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
                {showInnerTransactions && (
                  <Nav.Link
                    eventKey={TransactionInfoTabsEnum.innerTransactions}
                    className={`tab ${
                      activeKey === TransactionInfoTabsEnum.innerTransactions
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => {
                      const options = {
                        pathname: networkRoute(
                          urlBuilder.transactionDetailsInnerTransactions(
                            transaction.txHash
                          )
                        )
                      };
                      navigate(options, { replace: true });
                    }}
                  >
                    Inner Transactions
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
            <Tab.Pane eventKey={TransactionInfoTabsEnum.details}>
              <TransactionDetailsPanel transaction={transaction} />
            </Tab.Pane>

            {showLogs && (
              <Tab.Pane eventKey={TransactionInfoTabsEnum.logs}>
                <TransactionLogsPanel transaction={transaction} />
              </Tab.Pane>
            )}

            {showInnerTransactions && (
              <Tab.Pane eventKey={TransactionInfoTabsEnum.innerTransactions}>
                <InnerTransactionsPanel transaction={transaction} />
              </Tab.Pane>
            )}
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  );
};
