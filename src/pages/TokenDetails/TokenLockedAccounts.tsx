import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD } from 'appConstants';
import { AccountsTable } from 'components';
import { useAdapter } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TokenLockedAccountType } from 'types';

export const TokenDetailsLockedAccounts = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier, price, marketCap, supply, isLowLiquidity, decimals } =
    token;
  const { getTokenSupply } = useAdapter();

  const [tokenLockedAccounts, setTokenLockedAccounts] = useState<
    TokenLockedAccountType[]
  >([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchTokenLockedAccounts = () => {
    getTokenSupply({ tokenId: identifier }).then(({ data, success }) => {
      if (success && data?.lockedAccounts) {
        setTokenLockedAccounts(data.lockedAccounts);
      }
      setIsDataReady(success && data?.lockedAccounts);
    });
  };

  useEffect(() => {
    fetchTokenLockedAccounts();
  }, [activeNetworkId, identifier]);

  const showValue = Boolean(
    price &&
      marketCap &&
      (!isLowLiquidity ||
        new BigNumber(marketCap).isLessThan(
          LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD
        ))
  );

  return (
    <AccountsTable
      title={<TokenTabs />}
      accounts={tokenLockedAccounts}
      accountsCount={tokenLockedAccounts.length}
      price={price}
      supply={supply}
      decimals={decimals}
      showValue={showValue}
      isDataReady={isDataReady}
      hasNameColumn={true}
      message='Token Locked Accounts'
    />
  );
};
