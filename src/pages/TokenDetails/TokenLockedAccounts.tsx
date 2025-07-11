import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AccountsTable } from 'components';
import { isValidTokenPrice } from 'helpers';
import { useAdapter } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TokenLockedAccountType } from 'types';

export const TokenDetailsLockedAccounts = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier, price, supply, decimals } = token;
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
      setIsDataReady(Boolean(success && data?.lockedAccounts));
    });
  };

  useEffect(() => {
    fetchTokenLockedAccounts();
  }, [activeNetworkId, identifier]);

  const showValue = isValidTokenPrice(token);

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
