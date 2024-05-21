import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { NetworkLink, ShardSpan } from 'components';
import { urlBuilder } from 'helpers';
import { interfaceSelector } from 'redux/selectors';
import { setHighlightedText } from 'redux/slices/interface';
import { WithClassnameType } from 'types';

export interface ShardLinkUIType extends WithClassnameType {
  shard?: string | number;
  receiverShard?: boolean;
  senderShard?: boolean;
  hasHighlight?: boolean;
}

export const ShardLink = ({
  shard,
  receiverShard,
  senderShard,
  hasHighlight,
  className,
  'data-testid': dataTestId
}: ShardLinkUIType) => {
  const dispatch = useDispatch();
  const { highlightedText } = useSelector(interfaceSelector);

  if (shard === undefined) {
    return null;
  }

  const shardText = `shard${shard}`;
  let link = urlBuilder.shard(shard);
  if (senderShard) {
    link = urlBuilder.senderShard(shard);
  }
  if (receiverShard) {
    link = urlBuilder.receiverShard(shard);
  }

  return (
    <NetworkLink
      to={link}
      data-testid={dataTestId}
      className={classNames(className, {
        'text-highlighted': hasHighlight && highlightedText === shardText
      })}
      {...(hasHighlight
        ? {
            onMouseEnter: () => {
              dispatch(setHighlightedText(shardText));
            },
            onMouseLeave: () => dispatch(setHighlightedText(''))
          }
        : {})}
    >
      <ShardSpan shard={shard} />
    </NetworkLink>
  );
};
