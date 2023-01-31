export const getChartColorPalette = () => {
  const colorPalette = [
    'teal-500',
    'purple',
    'teal',
    'green-500',
    'yellow-500',
    'red'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  return colorPalette;
};
