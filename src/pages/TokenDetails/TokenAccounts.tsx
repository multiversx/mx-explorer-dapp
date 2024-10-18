import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD } from 'appConstants';
import { AccountsTable } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { AccountType } from 'types';

export const TokenDetailsAccounts = () => {
  const [searchParams] = useSearchParams();
  const { token } = useSelector(tokenSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { page, size } = useGetPage();
  const { getTokenAccounts, getTokenAccountsCount } = useAdapter();

  const {
    identifier,
    price,
    marketCap,
    supply,
    isLowLiquidity,
    decimals,
    accounts: totalAccounts
  } = token;

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchAccounts = () => {
    Promise.all([
      getTokenAccounts({ tokenId: identifier, page, size }),
      getTokenAccountsCount({ tokenId: identifier })
    ]).then(([tokenAccountsData, tokenAccountsCountData]) => {
      if (tokenAccountsData.success && tokenAccountsCountData.success) {
        setAccounts(tokenAccountsData.data);
        setAccountsCount(tokenAccountsCountData.data);
      }
      setIsDataReady(
        tokenAccountsData.success && tokenAccountsCountData.success
      );
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, totalAccounts, searchParams, identifier]);

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
      accounts={accounts}
      accountsCount={accountsCount}
      price={price}
      supply={supply}
      decimals={decimals}
      showValue={showValue}
      isDataReady={isDataReady}
      message='Token Holders'
    />
  );
};
