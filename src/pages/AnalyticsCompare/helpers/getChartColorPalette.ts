export const getChartColorPalette = () => {
  const colorPalette = [
    'teal-500',
    'green-500',
    'red',
    'yellow-500',
    'purple',
    'teal'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  return colorPalette;
};
