import { getColors } from 'helpers';

export const getChartColorPalette = () => {
  const colorPalette = getColors([
    'primary',
    'violet-500',
    'green-400',
    'amber-400',
    'orange-400',
    'red-400'
  ]);

  return colorPalette;
};
