import { HEROTAG_SUFFIX } from 'appConstants';

export const formatHerotag = (address?: string) => {
  if (!address) {
    return '';
  }

  const cleanName = address.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, '');

  return cleanName.endsWith(HEROTAG_SUFFIX)
    ? `${cleanName.replaceAll(HEROTAG_SUFFIX, '')}`
    : cleanName;
};
