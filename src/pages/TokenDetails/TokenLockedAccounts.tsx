import { useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  Loader,
  AccountLink,
  PageState,
  FormatAmount,
  FormatNumber,
  FormatUSD,
  PercentageBar
} from 'components';
import { formatBigNumber, parseAmount } from 'helpers';
import { useAdapter } from 'hooks';
import { faUser } from 'icons/regular';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TokenLockedAccountType } from 'types';

export const TokenDetailsLockedAccounts = () => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier, price, supply, decimals } = token;
  const { getTokenSupply } = useAdapter();

  const [tokenLockedAccounts, setTokenLockedAccounts] = useState<
    TokenLockedAccountType[]
  >([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTokenLockedAccounts = () => {
    getTokenSupply({ tokenId: identifier }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success && data?.lockedAccounts) {
          setTokenLockedAccounts(data.lockedAccounts);
        }
        setDataReady(success);
      }
    });
  };

  useEffect(() => {
    fetchTokenLockedAccounts();
  }, [activeNetworkId, identifier]);

  const showLockedAccounts =
    dataReady === true && tokenLockedAccounts.length > 0;
  const hasSupply = new BigNumber(supply ?? 0).isGreaterThan(0);

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <TokenTabs />
          </div>
        </div>
        {showLockedAccounts ? (
          <>
            <div className='card-body'>
              <div className='table-wrapper animated-list'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Name</th>
                      <th>Balance</th>
                      {hasSupply && (
                        <th className='percentage-column'>Percentage</th>
                      )}
                      {price && <th className='value-column'>Value</th>}
                    </tr>
                  </thead>
                  <tbody data-testid='tokenLockedAccountsTable'>
                    {tokenLockedAccounts.map((lockedAccount) => {
                      const holdingsPercentage = new BigNumber(
                        lockedAccount.balance
                      )
                        .times(100)
                        .dividedBy(parseAmount(supply, decimals));

                      return (
                        <tr key={lockedAccount.address}>
                          <td>
                            <AccountLink
                              address={lockedAccount.address}
                              assets={lockedAccount?.assets}
                              showLockedAccounts={false}
                              className={
                                hasSupply ? 'hash hash-lg' : 'full-hash'
                              }
                              linkClassName={hasSupply ? '' : 'trim-only-sm'}
                            />
                          </td>
                          <td>{lockedAccount.name}</td>
                          <td>
                            <FormatAmount
                              value={lockedAccount.balance}
                              decimals={decimals}
                              showLastNonZeroDecimal={true}
                              showLabel={false}
                              showSymbol={false}
                              showUsdValue={false}
                            />
                          </td>
                          {hasSupply && (
                            <td>
                              <div className='mb-1'>
                                <FormatNumber
                                  value={holdingsPercentage}
                                  label='%'
                                />
                              </div>
                              <PercentageBar
                                overallPercent={0}
                                fillPercent={holdingsPercentage.toNumber()}
                                fillPercentLabel={`${formatBigNumber({
                                  value: holdingsPercentage
                                })}%`}
                                type='small'
                              />
                            </td>
                          )}
                          {price && (
                            <td>
                              <FormatUSD
                                value={lockedAccount.balance}
                                decimals={decimals}
                                usd={price}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer'></div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader data-testid='tokenLockedAccountsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title='Unable to load Token Locked Account'
                isError
              />
            )}
            {dataReady === true && tokenLockedAccounts.length === 0 && (
              <PageState icon={faUser} title='No Token Locked Account' />
            )}
          </>
        )}
      </div>
    </div>
  );
};
