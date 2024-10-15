import { Overlay } from 'components';
import { formatDate } from 'helpers';
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

  const ms = value * 1000;
  let result = timeAgo(ms);

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
