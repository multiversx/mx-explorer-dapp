import classNames from 'classnames';

import { NetworkLink, Trim, AccountLink, ShardLink, TimeAgo } from 'components';
import { urlBuilder } from 'helpers';
import { UIEventType, WithClassnameType } from 'types';
import { EventIdentifierBadge } from './EventIdentifierBadge';

export interface EventRowUIType extends WithClassnameType {
  event: UIEventType;
}

export const EventRow = ({ event }: EventRowUIType) => {
  const { txHash, identifier, address, shardID, timestamp, isNew } = event;

  return (
    <tr className={classNames('animated-row', { new: isNew })}>
      <td>
        <div className='d-flex align-items-center hash'>
          <NetworkLink
            to={urlBuilder.eventDetails(txHash)}
            data-testid='transactionLink'
            className='trim-wrapper'
          >
            <Trim text={txHash} />
          </NetworkLink>
        </div>
      </td>
      <td className='text-neutral-400'>
        <TimeAgo value={timestamp} short tooltip />
      </td>
      <td>
        <div className='d-flex align-items-center'>
          <ShardLink
            shard={shardID}
            data-testid='shardFromLink'
            transactionSenderShard
            hasHighlight
          />
        </div>
      </td>
      <td>
        <AccountLink
          address={address}
          className='d-flex align-items-center trim-wrapper gap-2 hash hash-xxl'
          data-testid='addressLink'
          hasHighlight
        />
      </td>
      <td className='identifier text-truncate'>
        <EventIdentifierBadge identifier={identifier} hasHighlight />
      </td>
    </tr>
  );
};
