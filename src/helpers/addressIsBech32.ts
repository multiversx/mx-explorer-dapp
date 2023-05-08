export const addressIsBech32 = (destinationAddress = '') => {
  const isValidBech32 = !(
    !destinationAddress ||
    !destinationAddress.startsWith('erd') ||
    destinationAddress.length !== 62 ||
    /^\w+$/.test(destinationAddress) !== true
  );
  return isValidBech32;
};
