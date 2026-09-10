export const isHexString = (value: string) => /^[0-9a-fA-F]+$/.test(value);

export const isEvenHexString = (value: string) =>
  isHexString(value) && value.length % 2 === 0;
