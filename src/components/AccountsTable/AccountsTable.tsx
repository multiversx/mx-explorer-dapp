import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import {
  FormatAmount,
  AccountLink,
  FormatNumber,
  FormatUSD,
  PercentageBar,
  Pager,
  PageSize,
  Loader,
  PageState
} from 'components';
import { DECIMALS } from 'config';
import { formatBigNumber, parseAmount } from 'helpers';
import { faUser } from 'icons/regular';
import { AccountType, TokenLockedAccountType, WithClassnameType } from 'types';

export interface AccountsTableUIType extends WithClassnameType {
  accounts: AccountType[] | TokenLockedAccountType[];
  accountsCount: number;
  title?: React.ReactNode;
  message?: string;
  decimals?: number;
  showValue?: boolean;
  supply?: string | number;
  price?: number;
  isDataReady?: boolean;
  hasNameColumn?: boolean;
  isNativeToken?: boolean;
}

export const AccountsTable = ({
  accounts,
  accountsCount,
  title,
  message = 'Accounts',
  decimals = DECIMALS,
  showValue,
  price,
  supply,
  isNativeToken = false,
  isDataReady,
  hasNameColumn
}: AccountsTableUIType) => {
  const hasSupply = new BigNumber(supply ?? 0).isGreaterThan(0);
  const showAccounts = isDataReady === true && accounts.length > 0;

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          {title}
          <Pager
            total={accountsCount}
            show={accounts.length > 0}
            className='d-flex ms-auto me-auto me-sm-0'
          />
        </div>
      </div>
      {showAccounts ? (
        <>
          <div className='card-body'>
            <div className='table-wrapper animated-list'>
              <table className='table mb-0'>
                <thead>
                  <tr>
                    <th className={classNames({ 'w-50': !price })}>Address</th>
                    {hasNameColumn && <th>Name</th>}
                    <th>Balance</th>
                    {hasSupply && (
                      <th className='percentage-column'>Percentage</th>
                    )}
                    {showValue && <th className='value-column'>Value</th>}
                  </tr>
                </thead>
                <tbody data-testid='accountsTable'>
                  {accounts.map((account) => {
                    const holdingsPercentage =
                      hasSupply && supply
                        ? new BigNumber(account.balance)
                            .times(100)
                            .dividedBy(parseAmount(supply, decimals))
                        : new BigNumber(0);
                    const hasAccountName =
                      hasNameColumn && (account as TokenLockedAccountType).name;

                    return (
                      <tr key={account.address}>
                        <td>
                          <div className='d-flex align-items-center gap-2'>
                            <AccountLink
                              address={account.address}
                              assets={account.assets}
                              className={price ? 'hash hash-xl' : 'full-hash'}
                              linkClassName={price ? '' : 'trim-only-sm'}
                            />
                          </div>
                        </td>
                        {hasAccountName && (
                          <td>{(account as TokenLockedAccountType).name}</td>
                        )}
                        <td>
                          <FormatAmount
                            value={account.balance}
                            decimals={decimals}
                            showLastNonZeroDecimal={true}
                            showLabel={isNativeToken}
                            showSymbol={isNativeToken}
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
                        {showValue && (
                          <td>
                            <FormatUSD
                              value={account.balance}
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
          <div className='card-footer table-footer'>
            <PageSize />
            <Pager total={accountsCount} show={accounts.length > 0} />
          </div>
        </>
      ) : (
        <>
          {isDataReady === undefined && <Loader data-testid='accountsLoader' />}
          {isDataReady === false && (
            <PageState
              icon={faUser}
              title={`Unable to load ${message}`}
              isError
            />
          )}
          {isDataReady === true && accounts.length === 0 && (
            <PageState icon={faUser} title={`No ${message}`} />
          )}
        </>
      )}
    </div>
  );
};
