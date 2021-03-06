import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { faCogs } from '@fortawesome/pro-light-svg-icons/faCogs';
import { CardItem, CopyButton, Denominate, NetworkLink, Trim } from 'sharedComponents';
import { useGlobalState } from 'context';

const ProviderStats = ({ provider }: { provider: types.ProviderType | undefined }) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const website =
    provider && provider.identity && provider.identity.website
      ? provider.identity.website
      : undefined;

  return provider !== undefined ? (
    <div className="provider-stats card">
      <div className="card-body p-lg-spacer">
        <div className="row">
          <div className="col d-flex flex-row">
            <div className="flex-shrink-0">
              <h5>Contract Details</h5>
              {website && (
                <div className="mt-3">
                  <a
                    className="btn btn-primary"
                    target={`_blank`}
                    rel={`noreferrer nofollow`}
                    href={website}
                  >
                    Stake now
                  </a>
                </div>
              )}
            </div>
            <div className="d-flex flex-wrap flex-fill">
              <CardItem title="Public Address" icon={faCogs}>
                <NetworkLink
                  to={urlBuilder.accountDetails(provider.contract)}
                  className="trim-wrapper"
                >
                  <Trim text={provider.contract} />
                </NetworkLink>
                <CopyButton text={provider.contract} />
              </CardItem>

              <CardItem title="Contract Stake:" icon={faCogs}>
                <span className="text-secondary">
                  <Denominate value={provider.totalActiveStake} decimals={0} />
                </span>
              </CardItem>

              <CardItem title="Number of nodes:" icon={faCogs}>
                <span className="text-secondary">
                  {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
                </span>
              </CardItem>

              <CardItem title="Delegation Cap:" icon={faCogs}>
                <span className="text-secondary">
                  {provider.withDelegationCap
                    ? `${provider.maxDelegationCap} ${erdLabel}`
                    : `Unlimited`}
                </span>
              </CardItem>

              <CardItem title="Computed APR:" icon={faCogs}>
                <span className="text-secondary">{provider.apr}%</span>
              </CardItem>

              <CardItem title="Delegators:" icon={faCogs}>
                <span className="text-secondary">{provider.numUsers}</span>
              </CardItem>

              <CardItem title="Service fee:" icon={faCogs}>
                <span className="text-secondary">{provider.serviceFee}%</span>
              </CardItem>

              <CardItem title="Total Cumulated Rewards:" icon={faCogs}>
                <span className="text-secondary">
                  <Denominate value={provider.totalCumulatedRewards || '0'} decimals={0} />
                </span>
              </CardItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProviderStats;
