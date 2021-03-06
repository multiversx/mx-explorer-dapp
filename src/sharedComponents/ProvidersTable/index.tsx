import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { Denominate, NetworkLink, PageState, Trim } from 'sharedComponents';
import IdentityAvatar from 'sharedComponents/SharedIdentity/IdentityAvatar';
import CopyButton from 'sharedComponents/CopyButton';
import { useGlobalState } from 'context';

const ProvidersTable = ({
  providers,
  showIdentity = true,
}: {
  providers: types.ProviderType[];
  showIdentity?: boolean;
}) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  return (
    <div className="providers-table table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {showIdentity && <th data-testid="indentity">Validator Name</th>}
            <th data-testid="address">Public Address</th>
            <th>Stake</th>
            <th>Nodes</th>
            <th>Computed APR</th>
            <th>Service fee</th>
            <th>Delegation cap</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.contract}>
              {showIdentity && (
                <td>
                  <div className="d-flex align-items-center">
                    <IdentityAvatar identity={provider.identity || {}} />

                    {provider.identity ? (
                      <NetworkLink
                        to={urlBuilder.identityDetails(provider.identity.identity || '')}
                        className="trim-wrapper ml-2"
                      >
                        {provider.identity.name}
                      </NetworkLink>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </div>
                </td>
              )}
              <td>
                <div className="d-flex align-items-center">
                  <NetworkLink
                    to={urlBuilder.providerDetails(provider.contract)}
                    className="trim-wrapper"
                  >
                    <Trim text={provider.contract} />
                  </NetworkLink>
                  <CopyButton text={provider.contract} />
                </div>
              </td>
              <td>
                <Denominate value={provider.totalActiveStake} decimals={0} />
              </td>
              <td>
                {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
              </td>
              <td>{provider.apr}%</td>
              <td>{provider.serviceFee}%</td>
              <td>
                {provider.withDelegationCap
                  ? `${provider.maxDelegationCap} ${erdLabel}`
                  : `Unlimited`}
              </td>
            </tr>
          ))}
          {providers.length === 0 && (
            <tr>
              <td colSpan={showIdentity ? 2 : 1}>
                <PageState
                  icon={faCode}
                  title="No Providers"
                  className="py-spacer my-auto"
                  dataTestId="errorScreen"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProvidersTable;
