import { Denominate } from 'components';

export interface LockedStakeTooltipUIType {
  stake?: string;
  topUp?: string;
  auctionTopUp?: string;
  showAuctionTopup?: boolean;
}

export const LockedStakeTooltip = ({
  stake,
  topUp,
  auctionTopUp,
  showAuctionTopup
}: LockedStakeTooltipUIType) => {
  if ([stake, topUp, auctionTopUp].every((val) => val === undefined)) {
    return null;
  }

  return (
    <div className='d-flex flex-column gap-1'>
      {stake !== undefined && (
        <p className='mb-0'>
          Staked: <Denominate value={stake} showTooltip={false} />
        </p>
      )}
      {topUp !== undefined && !(showAuctionTopup && topUp === auctionTopUp) && (
        <p className='mb-0'>
          Top Up: <Denominate value={topUp} showTooltip={false} />
        </p>
      )}
      {auctionTopUp !== undefined && showAuctionTopup && (
        <p className='mb-0'>
          Qualified Top Up: <Denominate value={auctionTopUp} />
        </p>
      )}
    </div>
  );
};
