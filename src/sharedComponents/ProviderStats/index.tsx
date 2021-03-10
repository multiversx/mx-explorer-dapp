import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { CardItem, CopyButton, Denominate, NetworkLink, Trim } from 'sharedComponents';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
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
      <div className="card-body p-lg-spacer">
        <div className="row">
          <div className="col-12 col-lg-2 my-n2">
            <div className="d-flex flex-column py-3 justify-content-between h-100 align-items-center">
              <h5>Contract Details</h5>
              {website && (
                <div className="mt-3 w-100">
                  <a
                    className="btn btn-primary w-100"
                    target={`_blank`}
                    rel={`noreferrer nofollow`}
                    href={website}
                  >
                    Stake now
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-10 pr-0 my-n2 d-flex flex-wrap">
            <CardItem title="Public Address:" customIcon={<ElrondSymbol />}>
              <NetworkLink
                to={urlBuilder.accountDetails(provider.contract)}
                className="trim-wrapper"
              >
                <Trim text={provider.contract} />
              </NetworkLink>
              <CopyButton text={provider.contract} />
            </CardItem>

            <CardItem title="Number of nodes:" icon={faServer}>
              <span className="text-secondary">
                {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
              </span>
            </CardItem>

            <CardItem title="Computed APR:" icon={faChartBar}>
              <span className="text-secondary">{provider.apr}%</span>
            </CardItem>

            <CardItem title="Service fee:" icon={faPercent}>
              <span className="text-secondary">{provider.serviceFee}%</span>
            </CardItem>

            <CardItem title="Contract Stake:" icon={faLock}>
              <span className="text-secondary">
                <Denominate value={provider.totalActiveStake} decimals={0} />
              </span>
            </CardItem>

            <CardItem title="Delegation Cap:" icon={faArrowToTop}>
              <span className="text-secondary">
                {provider.withDelegationCap
                  ? `${provider.maxDelegationCap} ${erdLabel}`
                  : `Unlimited`}
              </span>
            </CardItem>

            <CardItem title="Delegators:" icon={faUser}>
              <span className="text-secondary">{provider.numUsers}</span>
            </CardItem>

            <CardItem title="Total Cumulated Rewards:" icon={faCoins}>
              <span className="text-secondary">
                <Denominate value={provider.totalCumulatedRewards || '0'} decimals={0} />
              </span>
            </CardItem>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProviderStats;
