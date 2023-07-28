export const getChartColorPalette = () => {
  const colorPalette = [
    'primary-500',
    'violet-500',
    'primary',
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
