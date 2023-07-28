export const formatHerotag = (address?: string) => {
  if (!address) {
    return '';
  }

  return address.endsWith('.elrond')
    ? `${address.replaceAll('.elrond', '')}`
    : address;
};
