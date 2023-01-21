export const sizeFormat = (size: number) => {
  if (isNaN(size)) return size.toString();
  let s = size / 1000;
  return s.toFixed(2) + ' kB';
};
