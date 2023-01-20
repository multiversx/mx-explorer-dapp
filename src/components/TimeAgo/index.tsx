import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import timeAgo from './timeAgo';
import { dateFormatted } from 'helpers';

const TimeAgo = ({
  value,
  short = false,
  tooltip = false,
}: {
  value: number;
  short?: boolean;
  tooltip?: boolean;
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
      placement="top"
      delay={{ show: 0, hide: 400 }}
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          {dateFormatted(value, false, true)}
        </Tooltip>
      )}
    >
      <span>{result}</span>
    </OverlayTrigger>
  ) : (
    <>{result}</>
  );
};

export default TimeAgo;
