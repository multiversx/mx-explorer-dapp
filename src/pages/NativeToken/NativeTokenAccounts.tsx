import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { AccountsTable } from 'components';
import { useAdapter, useGetNativeTokenDetails, useGetPage } from 'hooks';
import { NativeTokenTabs } from 'layouts/NativeTokenLayout/NativeTokenTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { AccountType } from 'types';

export const NativeTokenAccounts = () => {
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { price, marketCap, supply, decimals } = useGetNativeTokenDetails();
  const { page, size } = useGetPage();
  const { getAccounts, getAccountsCount } = useAdapter();

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchAccounts = () => {
    Promise.all([getAccounts({ page, size }), getAccountsCount({})]).then(
      ([tokenAccountsData, tokenAccountsCountData]) => {
        if (tokenAccountsData.success && tokenAccountsCountData.success) {
          setAccounts(tokenAccountsData.data);
          setAccountsCount(tokenAccountsCountData.data);
        }
        setIsDataReady(
          tokenAccountsData.success && tokenAccountsCountData.success
        );
      }
    );
  };

  useEffect(() => {
    fetchAccounts();
  }, [activeNetworkId, searchParams]);

  const showValue = Boolean(price && marketCap);

  return (
    <AccountsTable
      title={<NativeTokenTabs />}
      accounts={accounts}
      accountsCount={accountsCount}
      price={price}
      supply={supply}
      decimals={decimals}
      showValue={showValue}
      isNativeToken={true}
      isDataReady={isDataReady}
    />
  );
};
