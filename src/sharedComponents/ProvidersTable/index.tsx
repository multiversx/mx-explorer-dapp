import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { Denominate, NetworkLink, PageState, Trim } from 'sharedComponents';
import IdentityAvatar from 'sharedComponents/SharedIdentity/IdentityAvatar';
import CopyButton from 'sharedComponents/CopyButton';
import DelegationCap from './helpers/DelegationCap';
import PercentageFilled from './helpers/PercentageFilled';

const ProvidersTable = ({
  providers,
  showIdentity = true,
}: {
  providers: types.ProviderType[];
  showIdentity?: boolean;
}) => {
  return (
    <div className="providers-table table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {showIdentity ? <th>Validator Name</th> : <th>Address</th>}
            <th>Stake</th>
            <th>Nodes</th>
            <th>Computed APR</th>
            <th>Service fee</th>
            <th>Delegation cap</th>
            <th>Filled</th>
          </tr>
        </thead>
        <tbody data-testid="providersTable">
          {providers.map((provider, i) => (
            <tr key={provider.contract}>
              {showIdentity ? (
                <td>
                  <div className="d-flex align-items-center">
                    <IdentityAvatar identity={provider.identity || {}} />

                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.contract)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      {provider.identity && provider.identity.name ? (
                        <>{provider.identity.name}</>
                      ) : (
                        <Trim text={provider.contract} />
                      )}
                    </NetworkLink>
                  </div>
                </td>
              ) : (
                <td>
                  <div className="d-flex align-items-center">
                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.contract)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      <Trim text={provider.contract} />
                    </NetworkLink>
                    <CopyButton text={provider.contract} />
                  </div>
                </td>
              )}
              <td>
                <Denominate value={provider.totalActiveStake} />
              </td>
              <td>
                {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
              </td>
              <td>{provider.apr}%</td>
              <td>{parseInt(provider.serviceFee) / 100}%</td>
              <td>
                <DelegationCap maxDelegationCap={provider.maxDelegationCap} />
              </td>
              <td>
                <PercentageFilled
                  totalActiveStake={provider.totalActiveStake}
                  maxDelegationCap={provider.maxDelegationCap}
                />
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
