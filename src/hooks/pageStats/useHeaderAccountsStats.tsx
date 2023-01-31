import React, { useEffect, useState } from 'react';
import { useAdapter } from '../../components';

export type HeadersAccountsType = {
  totalAccounts: number;
  activeAccountsToday: number;
  newAccountsToday: number;
  usersStaking: number;
  accountsBalanceGt1000: number;
};

export const useHeaderAccountsStats = () => {
  const [accountHeaders, setAccountHeaders] = useState<HeadersAccountsType[]>();

  const { getGrowthHeaders } = useAdapter();

  const getHeadersAccounts = async (): Promise<HeadersAccountsType[]> => {
    const result = await getGrowthHeaders('/accounts');

    if (!result.success) {
      setAccountHeaders([]);
      return [];
    }

    setAccountHeaders(result.data);
    return result.data;
  };

  useEffect(() => {
    getHeadersAccounts();
  }, []);

  return {
    title: 'Accounts',
    accountHeaders
  };
};
