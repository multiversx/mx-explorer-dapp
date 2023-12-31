import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { formatDate } from 'helpers';
import { timeAgo } from './helpers/timeAgo';

export const TimeAgo = ({
  value,
  short = false,
  tooltip = false,
  showAgo = false
}: {
  value: number;
  short?: boolean;
  tooltip?: boolean;
  showAgo?: boolean;
}) => {
  const ms = value * 1000;
  let result = timeAgo(ms);

  if (short) {
    const parts = result.split(' ');
    if (parts.length > 1) {
      result = `${parts[0]} ${parts[1]}`;
    }
  }

  return tooltip ? (
    <OverlayTrigger
      placement='top'
      delay={{ show: 0, hide: 400 }}
      overlay={(props) => (
        <Tooltip id='button-tooltip' {...props}>
          {formatDate(value, false, true)}
        </Tooltip>
      )}
    >
      <span>
        {result}
        {showAgo ? ' ago' : ''}
      </span>
    </OverlayTrigger>
  ) : (
    <>
      {result}
      {showAgo ? ' ago' : ''}
    </>
  );
};
