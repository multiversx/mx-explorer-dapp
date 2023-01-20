import { ChartConfigType } from './types';

interface TickRangeType {
  config: Array<ChartConfigType>;
  filter?: string;
}

const formatTickRange = ({ config, filter }: TickRangeType) => {
  const { min, max } = config.reduce(
    (total, item) => {
      if (filter && item?.data?.[filter]) {
        const zero = item.zero;
        const data = item.data[filter].map((item: any) => item.value);
        const [min, max] = [zero ? 0 : Math.min(...data), Math.max(...data)];

        return {
          min: min > total.min && total.min !== 0 ? total.min : min,
          max: total.max < max ? max : total.max,
        };
      } else {
        return total;
      }
    },
    { min: 0, max: 0 }
  );

  const inbetweens = Array.from({ length: 3 }).map((item, index, total) =>
    Math.round(max - ((max - min) / 4) * (total.length - index))
  );

  return {
    ticks: [min, ...inbetweens, max],
    min,
  };
};

export default formatTickRange;
