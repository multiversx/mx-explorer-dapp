import { useSelector } from 'react-redux';

import {
  CardItem,
  CopyButton,
  FormatAmount,
  LockedAmountTooltip,
  AccountLink
} from 'components';
import {
  DelegationCap,
  PercentageFilled
} from 'components/ProvidersTable/components';
import { hasDelegationCap } from 'components/ProvidersTable/helpers';

import {
  faServer,
  faLock,
  faArrowToTop,
  faCoins,
  faChartPieAlt,
  faReceipt,
  faLeaf,
  faUserFriends,
  faUser
} from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';
import { ProviderType } from 'types';

export const ProviderDetailsCard = ({
  provider
}: {
  provider?: ProviderType;
}) => {
  const { walletAddress } = useSelector(activeNetworkSelector);

  return provider !== undefined ? (
    <div className='provider-details-card card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <h5 data-testid='title' className='mb-0 d-flex align-items-center'>
            Contract Details
          </h5>
          <a
            className='btn btn-sm btn-primary'
            target='_blank'
            rel='noreferrer nofollow noopener'
            href={walletAddress}
          >
            Stake now
          </a>
        </div>
        <div className='card-header-item compact card card-sm bg-table-header p-3 d-flex flex-row align-items-center mt-3'>
          <span className='flex-shrink-0 text-neutral-400 me-2'>Address:</span>
          <div className='d-flex flex-column min-w-0'>
            <div className='d-flex align-items-center'>
              <AccountLink address={provider.provider} data-testid='address' />
              <CopyButton text={provider.provider} />
            </div>
          </div>
        </div>
      </div>

      <div className='card-body card-item-container my-n2 mx-spacing'>
        <CardItem title='Number of nodes' icon={faServer}>
          {provider.numNodes !== undefined ? (
            <>
              {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
            </>
          ) : (
            <>N/A</>
          )}
        </CardItem>

        <CardItem title='Computed Net APR' icon={faLeaf}>
          {provider.apr ? (
            <>
              {provider.apr}
              {provider.apr !== 'N/A' ? '%' : ''}
            </>
          ) : (
            <>N/A</>
          )}
        </CardItem>

        <CardItem title='Service fee' icon={faReceipt}>
          {provider.serviceFee ? (
            <>{(provider.serviceFee * 100).toFixed(2)}%</>
          ) : (
            <>N/A</>
          )}
        </CardItem>

        <CardItem title='Locked' icon={faLock}>
          {provider.locked ? (
            <div className='d-flex align-items-center'>
              <FormatAmount value={provider.locked} />
              <LockedAmountTooltip
                small
                lockedDetails={[
                  {
                    label: 'Stake',
                    value: <FormatAmount value={provider.stake} />
                  },
                  {
                    label: 'Topup',
                    value: <FormatAmount value={provider.topUp} />
                  }
                ]}
              />
            </div>
          ) : (
            <>N/A</>
          )}
        </CardItem>

        <CardItem title='Delegators' icon={faUserFriends}>
          {provider.numUsers ? <>{provider.numUsers}</> : <>N/A</>}
        </CardItem>

        <CardItem title='Cumulated Rewards' icon={faCoins}>
          {provider.cumulatedRewards ? (
            <FormatAmount value={provider.cumulatedRewards} />
          ) : (
            <>0</>
          )}
        </CardItem>

        <CardItem title='Delegation Cap' icon={faArrowToTop}>
          {provider.delegationCap ? (
            <DelegationCap delegationCap={provider.delegationCap} />
          ) : (
            <>N/A</>
          )}
        </CardItem>

        {hasDelegationCap(provider.delegationCap) && (
          <CardItem title='Filled' icon={faChartPieAlt}>
            <PercentageFilled
              locked={provider.locked}
              delegationCap={provider.delegationCap}
            />
          </CardItem>
        )}

        {provider?.owner && (
          <CardItem title='Owner' icon={faUser}>
            <div className='d-flex align-items-center min-w-0'>
              <AccountLink address={provider.owner} />

              <CopyButton text={provider.owner} />
            </div>
          </CardItem>
        )}
      </div>
    </div>
  ) : null;
};
