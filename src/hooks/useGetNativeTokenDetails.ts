import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import { DECIMALS } from 'config';
import { useIsSovereign } from 'hooks';
import {
  economicsSelector,
  statsSelector,
  activeNetworkSelector
} from 'redux/selectors';
import { TokenAssetType } from 'types';

export interface NativeTokenType {
  identifier: string;
  ticker?: string;
  name: string;
  balance?: string;
  decimals?: number;
  supply: string | number;
  circulatingSupply: string | number;
  transactions: number;
  accounts: number;
  price?: number;
  marketCap?: number;
  valueUsd?: number;
  assets?: TokenAssetType;
  transfersCount?: number;
}

export const useGetNativeTokenDetails = () => {
  const { egldLabel, name, decimals } = useSelector(activeNetworkSelector);
  const {
    unprocessed: { price, marketCap, totalSupply, circulatingSupply }
  } = useSelector(economicsSelector);
  const {
    unprocessed: { accounts, transactions, scResults }
  } = useSelector(statsSelector);

  const isSovereign = useIsSovereign();

  const displayName = `${isSovereign ? name : BRAND_NAME} ${egldLabel}`;
  const description = isSovereign
    ? `${egldLabel} Token is native to ${name ?? BRAND_NAME}`
    : `The ${BRAND_NAME} eGold (${egldLabel}) Token is native to the ${BRAND_NAME} Network and will be used for everything from staking, governance, transactions, smart contracts and validator rewards.`;

  const nativeTokenTransactions = new BigNumber(transactions || 0).minus(
    scResults || 0
  );
  const assets = {
    name: displayName,
    description,
    ...(!isSovereign
      ? {
          website: 'https://multiversx.com/',
          social: {
            blog: 'https://multiversx.com/blog',
            x: 'https://x.com/MultiversX',
            telegram: 'https://t.me/MultiversX',
            discord: 'https://discord.com/invite/multiversxbuilders',
            facebook: 'https://www.facebook.com/MultiversX/',
            linkedin: 'https://www.linkedin.com/company/multiversx'
          }
        }
      : {})
  };

  return {
    identifier: egldLabel,
    ticker: egldLabel,
    name: egldLabel,
    decimals: Number(decimals ?? DECIMALS),
    supply: totalSupply,
    circulatingSupply,
    transactions: nativeTokenTransactions.isGreaterThanOrEqualTo(0)
      ? nativeTokenTransactions.toNumber()
      : 0,
    accounts,
    price,
    marketCap,
    assets
  };
};
