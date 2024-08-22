import { ELLIPSIS } from 'appConstants';
import { formatBigNumber } from 'helpers';
import { useGetEpochRemainingTime } from 'hooks';

import { NodeType, NodeStatusEnum } from 'types';

import { PanelCard } from './PanelCard';

export const TimeRemainingPanelCard = ({ node }: { node: NodeType }) => {
  const { epoch, remainingTime, isStatsFetched } = useGetEpochRemainingTime();
  const [days, hours, minutes, seconds] = remainingTime;

  const getRemainingTimeTitle = () => {
    if (node.status === NodeStatusEnum.auction) {
      return 'Auction ends in';
    }
    if (node.status === NodeStatusEnum.eligible) {
      return 'Next Rewards';
    }

    return <>Epoch {formatBigNumber({ value: epoch })} end</>;
  };

  return (
    <PanelCard
      title={getRemainingTimeTitle()}
      className='text-primary'
      featured
    >
      {isStatsFetched ? (
        <>
          {days.time && days.time !== '00' && (
            <>
              <span className='time-container'>{days.time}</span>d{' '}
            </>
          )}
          <span className='time-container'>{hours.time}</span>h{' '}
          <span className='time-container'>{minutes.time}</span>m{' '}
          <span className='time-container'>{seconds.time}</span>s
        </>
      ) : (
        ELLIPSIS
      )}
    </PanelCard>
  );
};
