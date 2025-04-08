import { Overlay } from 'components';
import { formatDate, formatTimestamp } from 'helpers';
import { WithClassnameType } from 'types';

import { timeAgo } from './helpers/timeAgo';

export interface TimeAgoUIType extends WithClassnameType {
  value: number;
  short?: boolean;
  tooltip?: boolean;
  showAgo?: boolean;
}

export const TimeAgo = ({
  value,
  short = false,
  tooltip = false,
  showAgo = false
}: TimeAgoUIType) => {
  if (!value) {
    return 'N/A';
  }

  let result = timeAgo(formatTimestamp(value));
  if (short) {
    const parts = result.split(' ');
    if (parts.length > 1) {
      result = `${parts[0]} ${parts[1]}`;
    }
  }

  return tooltip ? (
    <Overlay title={formatDate(value, false, true)} truncate>
      <span>
        {result}
        {showAgo ? ' ago' : ''}
      </span>
    </Overlay>
  ) : (
    <>
      {result}
      {showAgo ? ' ago' : ''}
    </>
  );
};
