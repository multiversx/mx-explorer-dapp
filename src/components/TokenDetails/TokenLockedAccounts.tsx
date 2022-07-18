import * as React from 'react';
import { useParams } from 'react-router-dom';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { useGlobalState } from 'context';
import {
  Loader,
  adapter,
  NetworkLink,
  Trim,
  ScAddressIcon,
  PageState,
  Denominate,
} from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { TokenLockedAccountType } from 'helpers/types';
import TokenTabs from './TokenLayout/TokenTabs';

const TokenLockedAccounts = () => {
  const ref = React.useRef(null);
  const { activeNetworkId, tokenDetails } = useGlobalState();
  const { getTokenSupply } = adapter();
  const { decimals } = tokenDetails;

  const { hash: tokenId } = useParams() as any;

  const [tokenLockedAccounts, setTokenLockedAccounts] = React.useState<TokenLockedAccountType[]>(
    []
  );
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenLockedAccounts = () => {
    getTokenSupply({ tokenId }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success && data?.lockedAccounts) {
          setTokenLockedAccounts(data.lockedAccounts);
        }
        setDataReady(success);
      }
    });
  };

  React.useEffect(() => {
    fetchTokenLockedAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId]);

  const showLockedAccounts = dataReady === true && tokenLockedAccounts.length > 0;

  return (
    <div ref={ref}>
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <TokenTabs />
          </div>
          {showLockedAccounts ? (
            <>
              <div className="card-body border-0 p-0">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th className="w-25">Name</th>
                        <th className="w-25">Balance</th>
                      </tr>
                    </thead>
                    <tbody data-testid="tokenLockedAccountsTable">
                      {tokenLockedAccounts.map((lockedAccount, i) => (
                        <tr key={lockedAccount.address}>
                          <td>
                            <div className="d-flex align-items-center">
                              <ScAddressIcon initiator={lockedAccount.address} />
                              <NetworkLink
                                to={urlBuilder.accountDetails(lockedAccount.address)}
                                className="trim-only-sm"
                              >
                                <Trim
                                  text={lockedAccount.address}
                                  dataTestId={`lockedAccountLink${i}`}
                                />
                              </NetworkLink>
                            </div>
                          </td>
                          <td>{lockedAccount.name}</td>
                          <td>
                            <Denominate
                              value={lockedAccount.balance}
                              showLastNonZeroDecimal={true}
                              showLabel={false}
                              denomination={decimals}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end"></div>
            </>
          ) : (
            <>
              {dataReady === undefined && <Loader dataTestId="tokenLockedAccountsLoader" />}
              {dataReady === false && (
                <PageState
                  icon={faUser}
                  title="Unable to loadToken Locked Account"
                  className="py-spacer my-auto"
                  dataTestId="errorScreen"
                />
              )}
              {dataReady === true && tokenLockedAccounts.length === 0 && (
                <PageState
                  icon={faUser}
                  title="No Token Locked Account"
                  className="py-spacer my-auto"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenLockedAccounts;
