import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCode } from '@fortawesome/pro-solid-svg-icons/faCode';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  adapter,
  DetailItem,
  Loader,
  Pager,
  PageState,
  NetworkLink,
  TimeAgo,
  Trim,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute, dateFormatted } from 'helpers';
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
          <div className="d-none d-sm-flex">
            {dataReady === true && accountScResults.length > 0 && (
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={accountScResultsCount}
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
                  <th scope="col">Txn Hash</th>
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                {accountScResults.map((scResult) => (
                  <tr className="animated-row trim-only-sm">
                    <td>
                      <div className="d-flex align-items-center">
                        <NetworkLink
                          to={`/transactions/${scResult.hash}`}
                          data-testid="transactionLink"
                          className="trim-wrapper"
                        >
                          <Trim text={scResult.hash} />
                        </NetworkLink>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                        <TimeAgo value={scResult.timestamp} /> ago &nbsp;
                        <span className="text-secondary">
                          ({dateFormatted(scResult.timestamp)})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer d-flex justify-content-end border-0 pt-0">
        {dataReady === true && accountScResults.length > 0 && (
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={accountScResultsCount}
            show={accountScResults.length > 0}
          />
        )}
      </div>
    </div>
  );
};

export default AccountScResults;
