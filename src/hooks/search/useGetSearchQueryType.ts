import { useSelector } from 'react-redux';

import {
  DEFAULT_HRP,
  HEROTAG_SUFFIX,
  NATIVE_TOKEN_IDENTIFIER
} from 'appConstants';
import { isHash, addressIsBech32, bech32, isEgldToken } from 'helpers';
import { useGetHrp } from 'hooks/useGetHrp';
import { Address } from 'lib';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetSearchQueryType = () => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const hrp = useGetHrp();

  const getSearchQueryType = (searchQuery?: string) => {
    if (!searchQuery) {
      return {};
    }

    const searchHash = String(searchQuery).trim();
    const validHashChars = /^[0-9A-Fa-f]+$/i;

    const isAccount = addressIsBech32(searchHash);
    const isValidHash = isHash(searchHash);
    const isNode =
      validHashChars.test(searchHash) === true && searchHash.length === 192;
    const isToken =
      searchHash.includes('-') &&
      searchHash.split('-')[1].length === 6 &&
      validHashChars.test(searchHash.split('-')[1]) === true;
    const isUsername =
      searchHash.startsWith('@') || searchHash.endsWith(HEROTAG_SUFFIX);
    const isNativeToken =
      NATIVE_TOKEN_IDENTIFIER.toLowerCase() === searchHash.toLowerCase() &&
      isEgldToken(egldLabel);

    let isPubKeyAccount = false;
    try {
      isPubKeyAccount =
        searchHash.length < 65 &&
        addressIsBech32(bech32.encode(searchHash, hrp));
    } catch {}
    let isErdAddress = false;
    try {
      const erdAddress = Address.newFromBech32(searchHash);
      isErdAddress = erdAddress.getHrp() === DEFAULT_HRP;
    } catch {}

    return {
      isAccount,
      isValidHash,
      isNode,
      isToken,
      isUsername,
      isNativeToken,
      isErdAddress,
      isPubKeyAccount
    };
  };

  return getSearchQueryType;
};
