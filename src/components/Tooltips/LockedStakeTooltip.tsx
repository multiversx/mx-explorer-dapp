import { FormatAmount } from 'components';

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
          Staked: <FormatAmount value={stake} showTooltip={false} />
        </p>
      )}
      {topUp !== undefined && (
        <p className='mb-0'>
          Top Up: <FormatAmount value={topUp} showTooltip={false} />
        </p>
      )}
      {auctionTopUp !== undefined && showAuctionTopup && (
        <p className='mb-0'>
          Qualified Top Up:{' '}
          <FormatAmount value={auctionTopUp} showTooltip={false} />
        </p>
      )}
    </div>
  );
};
