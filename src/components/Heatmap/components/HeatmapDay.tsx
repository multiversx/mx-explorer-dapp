import moment from 'moment';

import { Overlay } from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { ChartDataType } from 'types';

export const HeatmapDay = ({
  heat,
  day
}: {
  heat: number;
  day: ChartDataType;
}) => {
  const { timestamp, value } = day;
  const dateString = moment(timestamp).utc().format('ddd, MMM DD, YYYY');

  return (
    <Overlay
      title={
        <>
          {formatBigNumber({ value })}{' '}
          {getStringPlural(value, { string: 'transaction' })} on {dateString}
        </>
      }
      className={`d heat-${heat}`}
    ></Overlay>
  );
};
