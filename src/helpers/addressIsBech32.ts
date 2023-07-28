export const addressIsBech32 = (address = '') => {
  const isValidBech32 = !(
    !address ||
    !address.startsWith('erd') ||
    address.length !== 62 ||
    /^\w+$/.test(address) !== true
  );
  return isValidBech32;
};
