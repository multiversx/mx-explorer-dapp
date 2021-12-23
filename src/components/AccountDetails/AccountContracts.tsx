import React from 'react';
import { useParams } from 'react-router-dom';
import { faCode } from '@fortawesome/pro-solid-svg-icons/faCode';
import {
  adapter,
  Loader,
  Pager,
  PageState,
  NetworkLink,
  TimeAgo,
  Trim,
  ShardSpan,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, addressIsBech32 } from 'helpers';

export interface AccountSmartContractType {
  address: string;
  deployTxHash: string;
  timestamp: number;
}

const AccountContracts = () => {
  const ref = React.useRef(null);
  const { activeNetwork, accountDetails } = useGlobalState();
  const { size } = useFilters();

  const { getAccountContracts, getAccountContractsCount } = adapter();

  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountContracts, setAccountContracts] = React.useState<AccountSmartContractType[]>([]);
  const [accountContractsCount, setAccountContractsCount] = React.useState(0);

  const fetchAccountContracts = () => {
    Promise.all([
      getAccountContracts({
        size,
        address,
      }),
      getAccountContractsCount(address),
    ]).then(([accountContractsData, accountContractsCountData]) => {
      if (ref.current !== null) {
        if (accountContractsData.success && accountContractsCountData.success) {
          setAccountContracts(accountContractsData.data);
          setAccountContractsCount(accountContractsCountData.data);
        }
        setDataReady(accountContractsData.success && accountContractsCountData.success);
      }
    });
  };

  React.useEffect(() => {
    fetchAccountContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  return (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
          <div className="d-none d-md-flex">
            {dataReady === true && accountContracts.length > 0 && (
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={Math.min(accountContractsCount, 10000)}
                show={accountContracts.length > 0}
              />
            )}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {dataReady === undefined && <Loader dataTestId="contractsLoader" />}
        {dataReady === false && (
          <PageState
            icon={faCode}
            title="Unable to load Smart Contracts"
            className="py-spacer my-auto"
            dataTestId="errorScreen"
          />
        )}
        {dataReady === true && accountContracts.length === 0 && (
          <PageState icon={faCode} title="No Smart Contracts" className="py-spacer my-auto" />
        )}
        {dataReady === true && accountContracts.length > 0 && (
          <div className="table-wrapper animated-list">
            <table className="table" data-testid="transactionsTable">
              <thead>
                <tr>
                  <th scope="col">Address</th>
                  <th scope="col">Deployed</th>
                  <th scope="col">Deploy Transaction</th>
                </tr>
              </thead>
              <tbody>
                {accountContracts.map((contract) => {
                  return (
                    <tr className="animated-row" key={contract.deployTxHash}>
                      <td>
                        <div className="d-flex align-items-center trim-size-xl">
                          {addressIsBech32(contract.address) ? (
                            <NetworkLink
                              to={urlBuilder.accountDetails(contract.address)}
                              data-testid="addressLink"
                              className="trim-wrapper"
                            >
                              <Trim text={contract.address} />
                            </NetworkLink>
                          ) : (
                            <ShardSpan shard={contract.address} />
                          )}
                        </div>
                      </td>
                      <td>
                        <TimeAgo value={contract.timestamp} /> ago &nbsp;
                      </td>
                      <td>
                        <div className="d-flex align-items-center trim-size-xl">
                          <NetworkLink
                            to={`/transactions/${contract.deployTxHash}`}
                            data-testid="transactionLink"
                            className="trim-wrapper"
                          >
                            <Trim text={contract.deployTxHash} />
                          </NetworkLink>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {dataReady === true && accountContracts.length > 0 && (
        <div className="card-footer d-flex justify-content-end">
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={Math.min(accountContractsCount, 10000)}
            show={accountContracts.length > 0}
          />
        </div>
      )}
    </div>
  );
};

export default AccountContracts;
