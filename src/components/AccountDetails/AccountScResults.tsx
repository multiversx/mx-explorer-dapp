import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCode } from '@fortawesome/pro-solid-svg-icons/faCode';
import {
  adapter,
  Loader,
  Pager,
  PageState,
  NetworkLink,
  TimeAgo,
  Trim,
  ScAddressIcon,
  ShardSpan,
  Denominate,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute, addressIsBech32 } from 'helpers';
import { ScResultType } from 'helpers/types';

const AccountScResults = () => {
  const ref = React.useRef(null);
  const { activeNetwork, accountDetails } = useGlobalState();
  const { size } = useFilters();
  const networkRoute = useNetworkRoute();

  const { getAccountScResults, getAccountScResultsCount } = adapter();

  const { hash: address } = useParams() as any;
  const scResultsActive = activeNetwork.adapter === 'api';

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountScResults, setAccountScResults] = React.useState<ScResultType[]>([]);
  const [accountScResultsCount, setAccountScResultsCount] = React.useState(0);

  const fetchAccountScResults = () => {
    if (scResultsActive) {
      Promise.all([
        getAccountScResults({
          size,
          address,
        }),
        getAccountScResultsCount(address),
      ]).then(([accountScResultsData, accountScResultsCountData]) => {
        if (ref.current !== null) {
          if (accountScResultsData.success && accountScResultsCountData.success) {
            setAccountScResults(accountScResultsData.data);
            setAccountScResultsCount(accountScResultsCountData.data);
          }
          setDataReady(accountScResultsData.success && accountScResultsCountData.success);
        }
      });
    }
  };

  React.useEffect(() => {
    fetchAccountScResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  return !scResultsActive ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
          <div className="d-none d-md-flex">
            {dataReady === true && accountScResults.length > 0 && (
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={Math.min(accountScResultsCount, 10000)}
                show={accountScResults.length > 0}
              />
            )}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {dataReady === undefined && <Loader dataTestId="scResultsLoader" />}
        {dataReady === false && (
          <PageState
            icon={faCode}
            title="Unable to load Smart Contract Results"
            className="py-spacer my-auto"
            dataTestId="errorScreen"
          />
        )}
        {dataReady === true && accountScResults.length === 0 && (
          <PageState
            icon={faCode}
            title="No Smart Contract Results"
            className="py-spacer my-auto"
          />
        )}
        {dataReady === true && accountScResults.length > 0 && (
          <div className="table-wrapper animated-list">
            <table className="table" data-testid="transactionsTable">
              <thead>
                <tr>
                  <th scope="col">Original Txn Hash</th>
                  <th scope="col">Age</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {accountScResults.map((scResult) => {
                  const directionOut = address === scResult.sender;
                  const directionIn = address === scResult.receiver;
                  return (
                    <tr className="animated-row">
                      <td>
                        <div className="d-flex align-items-center trim-size-xl">
                          <NetworkLink
                            to={`/transactions/${scResult.originalTxHash}`}
                            data-testid="transactionLink"
                            className="trim-wrapper"
                          >
                            <Trim text={scResult.originalTxHash} />
                          </NetworkLink>
                        </div>
                      </td>
                      <td>
                        <TimeAgo value={scResult.timestamp} /> ago &nbsp;
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ScAddressIcon initiator={scResult.sender} />
                          {directionOut ? (
                            <Trim text={scResult.sender} />
                          ) : (
                            <>
                              {addressIsBech32(scResult.sender) ? (
                                <NetworkLink
                                  to={urlBuilder.accountDetails(scResult.sender)}
                                  data-testid="senderLink"
                                  className="trim-wrapper"
                                >
                                  <Trim text={scResult.sender} />
                                </NetworkLink>
                              ) : (
                                <ShardSpan shard={scResult.sender} />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        {scResult.receiver && (
                          <div className="d-flex align-items-center">
                            <ScAddressIcon initiator={scResult.receiver} />
                            {directionIn ? (
                              <Trim text={scResult.receiver} />
                            ) : (
                              <NetworkLink
                                to={urlBuilder.accountDetails(scResult.receiver)}
                                data-testid="receiverLink"
                                className="trim-wrapper"
                              >
                                <Trim text={scResult.receiver} />
                              </NetworkLink>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <Denominate value={scResult.value} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer d-flex justify-content-end">
        {dataReady === true && accountScResults.length > 0 && (
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={Math.min(accountScResultsCount, 10000)}
            show={accountScResults.length > 0}
          />
        )}
      </div>
    </div>
  );
};

export default AccountScResults;
