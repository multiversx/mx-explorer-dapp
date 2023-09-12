import { HEROTAG_SUFFIX } from 'appConstants';

export const formatHerotag = (address?: string) => {
  if (!address) {
    return '';
  }

  return address.endsWith(HEROTAG_SUFFIX)
    ? `${address.replaceAll(HEROTAG_SUFFIX, '')}`
    : address;
};
