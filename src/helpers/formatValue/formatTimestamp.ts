export const formatTimestamp = (value: number) => {
  if (value.toString().length === 10) {
    return value * 1000;
  }

  return value;
};
