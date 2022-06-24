import * as React from 'react';
import { faUserLock } from '@fortawesome/pro-regular-svg-icons/faUserLock';
import { useGlobalState } from 'context';
import { NetworkLink, Trim, ScAddressIcon, PageState } from 'sharedComponents';
import { urlBuilder, addressIsBech32 } from 'helpers';
import TokenTabs from './TokenLayout/TokenTabs';

const TokenAccounts = () => {
  const ref = React.useRef(null);
  const { tokenDetails } = useGlobalState();
  const { assets } = tokenDetails;

  return (
    <div ref={ref}>
      <div className="token-locked-accounts card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <TokenTabs />
          </div>
          {assets?.lockedAccounts ? (
            <>
              <div className="card-body border-0 p-0">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-50">Address</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody data-testid="accountsTable">
                      {Object.keys(assets.lockedAccounts).map((account, i) => {
                        const validAddress = addressIsBech32(account)
                          ? account
                          : addressIsBech32(assets?.lockedAccounts?.[account])
                          ? assets?.lockedAccounts?.[account]
                          : '';
                        return (
                          <tr key={account}>
                            <td>
                              {validAddress && (
                                <div className="d-flex align-items-center">
                                  <ScAddressIcon initiator={validAddress} />
                                  <NetworkLink
                                    to={urlBuilder.accountDetails(validAddress)}
                                    className="trim-only-sm"
                                  >
                                    <Trim text={validAddress} dataTestId={`accountLink${i}`} />
                                  </NetworkLink>
                                </div>
                              )}
                            </td>
                            <td>
                              {validAddress !== assets?.lockedAccounts?.[account]
                                ? assets?.lockedAccounts?.[account]
                                : ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end"></div>
            </>
          ) : (
            <PageState icon={faUserLock} title="No Locked Accounts" className="py-spacer my-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenAccounts;
