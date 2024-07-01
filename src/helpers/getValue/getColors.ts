export const getColors = (colors: string[] = []) => {
  return colors.map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );
};
