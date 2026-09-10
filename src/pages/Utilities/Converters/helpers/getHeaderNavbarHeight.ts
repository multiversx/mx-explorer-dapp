export const getHeaderNavbarHeight = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const headerHeight = rootStyles
    .getPropertyValue('--header-navbar-height')
    .trim();
  const parsedHeight = parseFloat(headerHeight);

  if (!parsedHeight) {
    return 0;
  }

  if (headerHeight.endsWith('rem')) {
    return parsedHeight * (parseFloat(rootStyles.fontSize) || 16);
  }

  return parsedHeight;
};
