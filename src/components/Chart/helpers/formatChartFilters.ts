import { DateFilterEnum } from './types';

export const formatChartFilters = ({
  data,
  filters
}: {
  data: any;
  filters: DateFilterEnum;
}) => {
  const keys = Object.keys(filters).filter((filter) =>
    Object.values(data).some(
      (item: any) => Array.isArray(item[filter]) && item[filter].length > 0
    )
  );

  return keys.reduce((object, key) => ({ ...object, [key]: key }), {});
};
