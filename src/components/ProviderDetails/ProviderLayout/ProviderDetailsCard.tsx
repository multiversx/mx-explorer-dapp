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
  faChartPieAlt,
} from '@fortawesome/pro-solid-svg-icons';
import DelegationCap from 'sharedComponents/ProvidersTable/helpers/DelegationCap';
import PercentageFilled from 'sharedComponents/ProvidersTable/helpers/PercentageFilled';

const ProviderDetailsCard = ({ provider }: { provider: types.ProviderType | undefined }) => {
  const {
    activeNetwork: { walletAddress },
  } = useGlobalState();

  const website = walletAddress;
  // provider && provider.identity && provider.identity.website
  //   ? provider.identity.website
  //   : walletAddress;

  return provider !== undefined ? (
    <div className="provider-details-card card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 data-testid="title">Contract Details</h6>
          <a
            className="btn btn-sm btn-primary-light"
            target={`_blank`}
            rel={`noreferrer nofollow`}
            href={website || ''}
          >
            Stake now
          </a>
        </div>
        <div className="card-header-item compact d-flex">
          <span className="flex-shrink-0">Address:</span>
          <div className="d-flex align-items-center text-break-all ml-2 text-secondary">
            <NetworkLink to={urlBuilder.accountDetails(provider.contract)} data-testid="address">
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
          <span className="text-secondary">{parseInt(provider.serviceFee) / 100}%</span>
        </CardItem>

        <CardItem title="Contract Stake" icon={faLock}>
          <span className="text-secondary">
            <Denominate value={provider.totalActiveStake} />
          </span>
        </CardItem>

        <CardItem title="Delegators" icon={faUser}>
          <span className="text-secondary">{provider.numUsers}</span>
        </CardItem>

        <CardItem title="Total Cumulated Rewards" icon={faCoins}>
          <span className="text-secondary">
            <Denominate value={provider.totalCumulatedRewards || '0'} />
          </span>
        </CardItem>

        <CardItem title="Delegation Cap" icon={faArrowToTop}>
          <span className="text-secondary">
            <DelegationCap maxDelegationCap={provider.maxDelegationCap} />
          </span>
        </CardItem>

        <CardItem title="Filled" icon={faChartPieAlt}>
          <span className="text-secondary">
            <PercentageFilled
              totalActiveStake={provider.totalActiveStake}
              maxDelegationCap={provider.maxDelegationCap}
            />
          </span>
        </CardItem>
      </div>
    </div>
  ) : null;
};

export default ProviderDetailsCard;
