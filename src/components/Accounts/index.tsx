import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, adapter, Pager, Denominate, NetworkLink, Trim } from 'sharedComponents';
import NoAccounts from './NoAccounts';
import FailedAccounts from './FailedAccounts';
import { types, urlBuilder, useSize, useURLSearchParams } from 'helpers';

const Transactions = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { page } = useURLSearchParams();
  const { size } = useSize();
  const { getAccounts, getAccountsCount } = adapter();

  const [accounts, setAccounts] = React.useState<types.AccountType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalAccounts, setTotalAccounts] = React.useState<number | '...'>('...');

  const fetchAccounts = () => {
    getAccounts({
      size,
    }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setAccounts(data);
        }
        setDataReady(success);
      }
    });
  };

  const fetchAccountsCount = () => {
    getAccountsCount({}).then(({ count, success }) => {
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
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Accounts</span>
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  {accounts && accounts.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Address</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody data-testid="accountsTable">
                              {accounts.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <div className="d-flex">
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer">
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
