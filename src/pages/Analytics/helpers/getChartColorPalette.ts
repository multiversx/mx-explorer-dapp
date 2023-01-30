export const getChartColorPalette = () => {
  const colorPalette = [
    'teal',
    'violet-400',
    'red',
    'orange',
    'green',
    'yellow',
    'blue'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  return colorPalette;
};
