import { useSelector } from 'react-redux';

import { InfoTooltip, Led } from 'components';
import { stakeSelector } from 'redux/selectors';

export const NodesOverviewCards = () => {
  const {
    auctionValidators,
    qualifiedAuctionValidators,
    notQualifiedAuctionValidators,
    dangerZoneValidators
  } = useSelector(stakeSelector);

  return (
    <>
      <div className='card bg-neutral-800-opacity-60 h-100 flex-fill flex-sm-grow-0'>
        <div className='card-body d-flex flex-column gap-1 text-neutral-400'>
          <span className='text-neutral-500'>Qualified Nodes</span>
          <h2 className='mb-0 text-success'>{qualifiedAuctionValidators}</h2>
          {notQualifiedAuctionValidators && (
            <span className='text-neutral-400'>
              <span className='text-orange-400'>{dangerZoneValidators}</span>{' '}
              qualified nodes in the Danger Zone
              <InfoTooltip
                title={
                  <>
                    <p className='mb-2 h6'>
                      Danger Zone <Led color='bg-orange-400 ms-1' />
                    </p>
                    <p className='text-neutral-400 mb-0'>
                      {dangerZoneValidators} nodes are under the 5% threshold
                      level. Increase the staked amount / node to exit the
                      danger zone and move up in the auction list.
                    </p>
                  </>
                }
                tooltipClassName='tooltip-text-start tooltip-lg'
              />
            </span>
          )}
        </div>
      </div>
      <div className='card bg-neutral-800-opacity-60 h-100 flex-fill'>
        <div className='card-body d-flex flex-column gap-1 text-neutral-400'>
          <span className='text-neutral-500'>Total Nodes in Auction List</span>
          <h2 className='mb-0 text-neutral-100'>{auctionValidators}</h2>
          <span className='text-neutral-400'>
            <span className='text-red-400'>
              {notQualifiedAuctionValidators}
            </span>{' '}
            Not Qualified
          </span>
        </div>
      </div>
    </>
  );
};
