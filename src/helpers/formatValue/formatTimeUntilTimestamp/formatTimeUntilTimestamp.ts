import moment from 'moment';

import {
  FormatTimeUntilTimestampPropsType,
  FormatterType,
  TimeGroupLabelEnum,
  TimeGroupType
} from './formatTimeUntilTimestamp.types';

export const formatTimeUntilTimestamp = ({
  timestamp,
  excludeTimeGroup,
  showZeroDecimal = true
}: FormatTimeUntilTimestampPropsType): TimeGroupType[] => {
  const targetTimestamp = moment.unix(timestamp);
  const presentTimestamp = moment().unix();
  const timestampDifference =
    targetTimestamp.valueOf() / 1000 - presentTimestamp;

  const durationAsSeconds = moment.duration(
    timestampDifference,
    TimeGroupLabelEnum.seconds
  );

  const days = String(Math.floor(durationAsSeconds.asDays()));
  const formatters: FormatterType[] = [
    [TimeGroupLabelEnum.days, showZeroDecimal ? days.padStart(2, '0') : days],
    [TimeGroupLabelEnum.hours, showZeroDecimal ? 'HH' : 'H'],
    [TimeGroupLabelEnum.minutes, showZeroDecimal ? 'mm' : 'm'],
    [TimeGroupLabelEnum.seconds, showZeroDecimal ? 'ss' : 's']
  ];

  const format = (key: string) => {
    const miliseconds = moment
      .duration(timestampDifference, TimeGroupLabelEnum.seconds)
      .asMilliseconds();

    return moment.utc(miliseconds).format(key);
  };

  const filterTimeGroupsOptionally = (timeGroups: TimeGroupType[]) =>
    timeGroups.filter((time) =>
      excludeTimeGroup ? !excludeTimeGroup.includes(time.label) : true
    );

  if (durationAsSeconds.isValid() && durationAsSeconds.asSeconds() >= 0) {
    const timeGroups = formatters.map(([label, pattern]: FormatterType) => ({
      label,
      time: format(pattern)
    }));

    if (excludeTimeGroup && Array.isArray(excludeTimeGroup)) {
      return filterTimeGroupsOptionally(timeGroups);
    }

    return timeGroups;
  }

  if (timestamp === 0) {
    return [];
  }

  return filterTimeGroupsOptionally(
    formatters.map(([label]) => ({
      time: showZeroDecimal ? '00' : '0',
      label
    }))
  );
};
