import * as React from 'react';
import { useGlobalState } from 'context';
import {
  Loader,
  adapter,
  Pager,
  Denominate,
  NetworkLink,
  Trim,
  ScAddressIcon,
  AccountDetailsBlock,
} from 'sharedComponents';
import { urlBuilder, useSize, useURLSearchParams } from 'helpers';
import { AccountType } from 'helpers/types';
import NoAccounts from './NoAccounts';
import FailedAccounts from './FailedAccounts';

const Transactions = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { page } = useURLSearchParams();
  const { size } = useSize();
  const { getAccounts, getAccountsCount } = adapter();

  const [accounts, setAccounts] = React.useState<AccountType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalAccounts, setTotalAccounts] = React.useState<number | '...'>('...');

  const fetchAccounts = () => {
    getAccounts(size).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setAccounts(data);
        }
        setDataReady(success);
      }
    });
  };

  const fetchAccountsCount = () => {
    getAccountsCount().then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalAccounts(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(() => {
    fetchAccounts();
    fetchAccountsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedAccounts />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  {accounts && accounts.length > 0 ? (
                    <>
                      <div className="card-header">
                        <div className="card-header-item d-flex justify-content-between align-items-center">
                          <h6 data-testid="title">Accounts</h6>
                          <div className="d-none d-sm-flex">
                            <Pager
                              page={String(page)}
                              total={
                                totalAccounts !== '...'
                                  ? Math.min(totalAccounts, 10000)
                                  : totalAccounts
                              }
                              itemsPerPage={25}
                              show={accounts.length > 0}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Address</th>
                                <th className="w-25">Balance</th>
                                <th className="w-25">Details</th>
                              </tr>
                            </thead>
                            <tbody data-testid="accountsTable">
                              {accounts.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <ScAddressIcon initiator={account.address} />
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(account.address)}
                                        className="trim-only-sm"
                                      >
                                        <Trim
                                          text={account.address}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>
                                    <Denominate value={account.balance} />
                                  </td>
                                  <td>
                                    {account.assets && (
                                      <AccountDetailsBlock assets={account.assets} />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer d-flex justify-content-end">
                        <Pager
                          page={String(page)}
                          total={
                            totalAccounts !== '...' ? Math.min(totalAccounts, 10000) : totalAccounts
                          }
                          itemsPerPage={25}
                          show={accounts.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoAccounts />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
