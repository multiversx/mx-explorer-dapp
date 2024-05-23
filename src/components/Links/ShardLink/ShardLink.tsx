import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { NetworkLink, ShardSpan } from 'components';
import { urlBuilder, getShardText } from 'helpers';
import { useFetchShards, useIsSovereign } from 'hooks';
import { interfaceSelector, shardsSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
import { WithClassnameType } from 'types';

export interface ShardLinkUIType extends WithClassnameType {
  shard?: string | number;
  transactionReceiverShard?: boolean;
  transactionSenderShard?: boolean;
  hasHighlight?: boolean;
  hasParanthesis?: boolean;
}

export const ShardLink = ({
  shard,
  transactionReceiverShard,
  transactionSenderShard,
  hasHighlight,
  hasParanthesis,
  className,
  'data-testid': dataTestId
}: ShardLinkUIType) => {
  const dispatch = useDispatch();
  const isSovereign = useIsSovereign();
  const shards = useSelector(shardsSelector);
  const { highlightedText } = useSelector(interfaceSelector);

  useFetchShards();

  if (shard === undefined) {
    return <span className='text-neutral-400'>N/A</span>;
  }

  const shardText = getShardText(shard, isSovereign);
  if (!shardText) {
    return null;
  }

  const isLinkableShard = shards.find(
    (searchShard) => searchShard.shard === shard
  );
  const isSovereignShard = isSovereign && shard === 0;
  const hasLink = isLinkableShard && !isSovereignShard;

  const shardHighlightKey = `shard${shard}`;
  let link = urlBuilder.shard(shard);
  if (transactionSenderShard) {
    link = urlBuilder.senderShard(shard);
  }
  if (transactionReceiverShard) {
    link = urlBuilder.receiverShard(shard);
  }

  const ShardDisplay = ({ className }: WithClassnameType) => {
    if (!hasLink) {
      return (
        <span
          data-testid={dataTestId}
          className={classNames(className, {
            'text-highlighted':
              hasHighlight && highlightedText === shardHighlightKey,
            'text-neutral-400': isSovereignShard
          })}
          {...(hasHighlight
            ? {
                onMouseEnter: () => {
                  dispatch(setHighlightedText(shardHighlightKey));
                },
                onMouseLeave: () => dispatch(setHighlightedText(''))
              }
            : {})}
        >
          <ShardSpan shard={shard} />
        </span>
      );
    }

    return (
      <NetworkLink
        to={link}
        data-testid={dataTestId}
        className={classNames(className, {
          'text-highlighted':
            hasHighlight && highlightedText === shardHighlightKey
        })}
        {...(hasHighlight
          ? {
              onMouseEnter: () => {
                dispatch(setHighlightedText(shardHighlightKey));
              },
              onMouseLeave: () => dispatch(setHighlightedText(''))
            }
          : {})}
      >
        <ShardSpan shard={shard} />
      </NetworkLink>
    );
  };

  if (hasParanthesis) {
    return (
      <span className={classNames('text-neutral-400', className)}>
        (<ShardDisplay className='' />)
      </span>
    );
  }

  return <ShardDisplay className={classNames(className)} />;
};
