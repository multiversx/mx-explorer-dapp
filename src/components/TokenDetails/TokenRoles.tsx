import * as React from 'react';
import { useParams } from 'react-router-dom';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { useGlobalState } from 'context';
import { Loader, adapter, NetworkLink, Trim, ScAddressIcon, PageState } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { TokenRolesType } from 'helpers/types';
import TokenTabs from './TokenLayout/TokenTabs';

const TokenRoles = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getTokenRoles } = adapter();

  const { hash: tokenId } = useParams() as any;

  const [tokenRoles, setTokenRoles] = React.useState<TokenRolesType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenRoles = () => {
    getTokenRoles({ tokenId }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setTokenRoles(data);
        }
        setDataReady(success);
      }
    });
  };

  React.useEffect(() => {
    fetchTokenRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId]);

  const showRoles = dataReady === true && tokenRoles.length > 0;

  return (
    <div ref={ref}>
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <TokenTabs />
          </div>
          {showRoles ? (
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
                      {tokenRoles.map((tokenRole, i) => (
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
                                className="badge badge-secondary badge-pill font-weight-light mr-2"
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
            <>
              {dataReady === undefined && <Loader dataTestId="tokenRolesLoader" />}
              {dataReady === false && (
                <PageState
                  icon={faUser}
                  title="Unable to load Token Roles"
                  className="py-spacer my-auto"
                  dataTestId="errorScreen"
                />
              )}
              {dataReady === true && tokenRoles.length === 0 && (
                <PageState icon={faUser} title="No Token Roles" className="py-spacer my-auto" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRoles;
