export const formatSize = (size: number) => {
  if (isNaN(size)) return size.toString();
  const s = size / 1000;
  return s.toFixed(2) + ' kB';
};
