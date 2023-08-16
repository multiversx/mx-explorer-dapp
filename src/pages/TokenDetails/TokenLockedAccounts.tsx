import React, { useEffect, useRef, useState } from 'react';
import { faUser } from 'icons/regular';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  Loader,
  NetworkLink,
  Trim,
  ScAddressIcon,
  PageState,
  Denominate
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TokenLockedAccountType } from 'types';

export const TokenDetailsLockedAccounts = () => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { decimals } = token;
  const { getTokenSupply } = useAdapter();

  const { hash: tokenId } = useParams() as any;

  const [tokenLockedAccounts, setTokenLockedAccounts] = useState<
    TokenLockedAccountType[]
  >([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTokenLockedAccounts = () => {
    getTokenSupply({ tokenId }).then(({ data, success }) => {
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
  }, [activeNetworkId]);

  const showLockedAccounts =
    dataReady === true && tokenLockedAccounts.length > 0;

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
                      <th className='w-25'>Name</th>
                      <th className='w-25'>Balance</th>
                    </tr>
                  </thead>
                  <tbody data-testid='tokenLockedAccountsTable'>
                    {tokenLockedAccounts.map((lockedAccount, i) => (
                      <tr key={lockedAccount.address}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <ScAddressIcon initiator={lockedAccount.address} />
                            <NetworkLink
                              to={urlBuilder.accountDetails(
                                lockedAccount.address
                              )}
                              className='trim-only-sm'
                            >
                              <Trim
                                text={lockedAccount.address}
                                dataTestId={`lockedAccountLink${i}`}
                              />
                            </NetworkLink>
                          </div>
                        </td>
                        <td>{lockedAccount.name}</td>
                        <td>
                          <Denominate
                            value={lockedAccount.balance}
                            showLastNonZeroDecimal={true}
                            showLabel={false}
                            denomination={decimals}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='card-footer'></div>
          </>
        ) : (
          <>
            {dataReady === undefined && (
              <Loader dataTestId='tokenLockedAccountsLoader' />
            )}
            {dataReady === false && (
              <PageState
                icon={faUser}
                title='Unable to loadToken Locked Account'
                className='py-spacer my-auto'
                dataTestId='errorScreen'
              />
            )}
            {dataReady === true && tokenLockedAccounts.length === 0 && (
              <PageState
                icon={faUser}
                title='No Token Locked Account'
                className='py-spacer my-auto'
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
