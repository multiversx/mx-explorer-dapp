import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ZERO } from 'appConstants';
import {
  FormatAmount,
  FormatUSD,
  CardItem,
  AccountLink,
  CopyButton
} from 'components';
import { isValidAccountTokenValue } from 'helpers';
import { useAdapter, useGetTransactionFilters } from 'hooks';
import { faUser, faCoins, faDollarSign } from 'icons/solid';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TokenType } from 'types';

export const TokenHolderDetailsCard = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier } = token;
  const { sender, receiver } = useGetTransactionFilters();
  const { getAccountTokens } = useAdapter();

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [accountTokenDetails, setAccountTokenDetails] = useState<TokenType>();

  const filterAddress = sender || receiver;
  const address = String(filterAddress);
  const usdValue =
    accountTokenDetails?.valueUsd &&
    isValidAccountTokenValue(accountTokenDetails)
      ? accountTokenDetails.valueUsd
      : ZERO;

  const fetchAccountTokens = async () => {
    const { data, success } = await getAccountTokens({
      address,
      identifier,
      includeMetaESDT: true,
      fields: ['balance', 'valueUsd'].join(',')
    });
    if (success && data && data.length <= 1) {
      setAccountTokenDetails(data[0]);
    }
    setIsDataReady(success);
  };

  useEffect(() => {
    if (address) {
      fetchAccountTokens();
    }
  }, [activeNetworkId, address, identifier]);

  if (!address || !isDataReady) {
    return null;
  }

  return (
    <div className='card mb-3'>
      <div className='px-2 px-lg-3 d-flex flex-wrap'>
        <CardItem title='Filtered by Token Holder' icon={faUser} className='n3'>
          <AccountLink address={address} />
          <CopyButton text={address} />
        </CardItem>
        <CardItem title='Balance' icon={faCoins} className='n3'>
          <div className='d-flex align-items-center'>
            <FormatAmount
              value={accountTokenDetails?.balance ?? ZERO}
              showLabel={false}
              showSymbol={false}
              decimals={token.decimals}
              showUsdValue={false}
            />{' '}
            <div className='d-flex align-items-center symbol text-truncate ms-1'>
              {token?.assets?.svgUrl && (
                <img
                  src={token.assets.svgUrl}
                  className='side-icon me-1'
                  alt=''
                  role='presentation'
                />
              )}
              <span className='text-truncate'>{token?.ticker}</span>
            </div>
          </div>
        </CardItem>
        <CardItem title='Value' icon={faDollarSign} className='n3'>
          <FormatUSD value={usdValue} usd={1} />
        </CardItem>
      </div>
    </div>
  );
};
