import * as React from 'react';
import { types, urlBuilder, stringIsInteger } from 'helpers';
import {
  CardItem,
  CopyButton,
  Denominate,
  LockedAmountTooltip,
  NetworkLink,
} from 'sharedComponents';
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
import DelegationCap from 'sharedComponents/ProvidersTable/DelegationCap';
import PercentageFilled from 'sharedComponents/ProvidersTable/PercentageFilled';
import { getPercentageFilled } from 'sharedComponents/ProvidersTable/PercentageFilled';

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
            {provider.numNodes !== undefined ? (
              <>
                {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
              </>
            ) : (
              <>N/A</>
            )}
          </span>
        </CardItem>

        <CardItem title="Computed APR" icon={faChartBar}>
          <span className="text-secondary">
            {provider.apr ? (
              <>
                {provider.apr}
                {provider.apr !== 'N/A' ? '%' : ''}
              </>
            ) : (
              <>N/A</>
            )}
          </span>
        </CardItem>

        <CardItem title="Service fee" icon={faPercent}>
          <span className="text-secondary">
            {provider.serviceFee ? <>{parseInt(provider.serviceFee) / 100}%</> : <>N/A</>}
          </span>
        </CardItem>

        <CardItem title="Locked" icon={faLock}>
          {provider.totalActiveStake ? (
            <div className="d-flex align-items-center">
              <span className="mr-2">
                <Denominate value={provider.totalActiveStake} />
              </span>

              {/* <LockedAmountTooltip
                lockedDetails={[
                  { label: 'Stake', value: <Denominate value={provider.totalActiveStake} /> },
                  {
                    label: 'Topup',
                    value: <Denominate value={provider.topUp} />,
                  },
                ]}
              /> */}
            </div>
          ) : (
            <span className="text-secondary">N/A</span>
          )}
        </CardItem>

        <CardItem title="Delegators" icon={faUser}>
          <span className="text-secondary">
            {provider.numUsers ? <>{provider.numUsers}</> : <>N/A</>}
          </span>
        </CardItem>

        <CardItem title="Total Cumulated Rewards" icon={faCoins}>
          <span className="text-secondary">
            {provider.totalCumulatedRewards ? (
              <Denominate value={provider.totalCumulatedRewards} />
            ) : (
              <>0</>
            )}
          </span>
        </CardItem>

        <CardItem title="Delegation Cap" icon={faArrowToTop}>
          <span className="text-secondary">
            {provider.maxDelegationCap ? (
              <DelegationCap maxDelegationCap={provider.maxDelegationCap} />
            ) : (
              <>N/A</>
            )}
          </span>
        </CardItem>

        {stringIsInteger(
          getPercentageFilled(provider.totalActiveStake, provider.maxDelegationCap)
        ) && (
          <CardItem title="Filled" icon={faChartPieAlt}>
            <span className="text-secondary">
              <PercentageFilled
                totalActiveStake={provider.totalActiveStake}
                maxDelegationCap={provider.maxDelegationCap}
              />
            </span>
          </CardItem>
        )}
      </div>
    </div>
  ) : null;
};

export default ProviderDetailsCard;
