import * as React from 'react';

import { useGlobalState } from 'context';
import { Loader, NetworkLink, Trim, ScAddressIcon } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import TokenTabs from './TokenLayout/TokenTabs';

const TokenRoles = () => {
  const ref = React.useRef(null);
  const {
    tokenDetails: { roles },
  } = useGlobalState();

  return (
    <div ref={ref}>
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <TokenTabs />
          </div>
          {roles ? (
            <>
              <div className="card-body border-0 p-0">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Roles</th>
                      </tr>
                    </thead>
                    <tbody data-testid="tokenRolesTable">
                      {roles.map((tokenRole, i) => (
                        <tr key={tokenRole.address}>
                          <td>
                            <div className="d-flex align-items-center">
                              <ScAddressIcon initiator={tokenRole.address} />
                              <NetworkLink
                                to={urlBuilder.accountDetails(tokenRole.address)}
                                className="trim-only-sm"
                              >
                                <Trim text={tokenRole.address} dataTestId={`roleLink${i}`} />
                              </NetworkLink>
                            </div>
                          </td>
                          <td>
                            {tokenRole.roles.map((role, index) => (
                              <div
                                className="badge badge-secondary badge-pill font-weight-normal mr-2"
                                key={`${tokenRole.address}-${index}`}
                              >
                                {role}
                              </div>
                            ))}
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
            <>{roles === undefined && <Loader dataTestId="tokenRolesLoader" />}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRoles;
