import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { CardItem, CopyButton, Denominate, NetworkLink } from 'sharedComponents';
import { useGlobalState } from 'context';
import {
  faServer,
  faChartBar,
  faPercent,
  faLock,
  faArrowToTop,
  faUser,
  faCoins,
} from '@fortawesome/pro-solid-svg-icons';

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
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 data-testid="title">Contract Details</h6>

          {website && (
            <a
              className="btn btn-sm btn-primary"
              target={`_blank`}
              rel={`noreferrer nofollow`}
              href={website}
            >
              Stake now
            </a>
          )}
        </div>
        <div className="card-header-item compact d-flex">
          <span className="flex-shrink-0">Address:</span>
          <div className="d-flex align-items-center text-break-all ml-2 text-secondary">
            <NetworkLink to={urlBuilder.accountDetails(provider.contract)}>
              {provider.contract}
            </NetworkLink>
            <CopyButton text={provider.contract} />
          </div>
        </div>
      </div>

      <div className="card-body card-item-container">
        <CardItem title="Number of nodes" icon={faServer}>
          <span className="text-secondary">
            {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
          </span>
        </CardItem>

        <CardItem title="Computed APR" icon={faChartBar}>
          <span className="text-secondary">{provider.apr}%</span>
        </CardItem>

        <CardItem title="Service fee" icon={faPercent}>
          <span className="text-secondary">{provider.serviceFee}%</span>
        </CardItem>

        <CardItem title="Contract Stake" icon={faLock}>
          <span className="text-secondary">
            <Denominate value={provider.totalActiveStake} decimals={0} />
          </span>
        </CardItem>

        <CardItem title="Delegation Cap" icon={faArrowToTop}>
          <span className="text-secondary">
            {provider.withDelegationCap ? `${provider.maxDelegationCap} ${erdLabel}` : `Unlimited`}
          </span>
        </CardItem>

        <CardItem title="Delegators" icon={faUser}>
          <span className="text-secondary">{provider.numUsers}</span>
        </CardItem>

        <CardItem title="Total Cumulated Rewards" icon={faCoins}>
          <span className="text-secondary">
            <Denominate value={provider.totalCumulatedRewards || '0'} decimals={0} />
          </span>
        </CardItem>
      </div>
    </div>
  ) : null;
};

export default ProviderStats;
