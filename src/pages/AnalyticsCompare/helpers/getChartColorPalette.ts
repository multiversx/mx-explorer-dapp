import { getColors } from 'helpers';

export const getChartColorPalette = () => {
  const colorPalette = getColors([
    'primary-500',
    'violet-500',
    'primary',
    'green-500',
    'yellow-500',
    'red'
  ]);

  return colorPalette;
};
