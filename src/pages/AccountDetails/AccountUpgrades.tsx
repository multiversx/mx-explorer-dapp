import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  Loader,
  PageState,
  NetworkLink,
  TimeAgo,
  Trim,
  AccountLink
} from 'components';
import { isContract } from 'helpers';
import { useAdapter } from 'hooks';
import { faCode } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { AccountUpgradeType } from 'types';

export const AccountUpgrades = () => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { txCount } = account;

  const { getAccountUpgrades } = useAdapter();
  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountUpgrades, setAccountUpgrades] =
    React.useState<AccountUpgradeType[]>();

  const fetchAccountUpgrades = () => {
    if (isContract(address)) {
      getAccountUpgrades({ address, size: 100 }).then(({ success, data }) => {
        if (ref.current !== null) {
          setDataReady(success);
          if (success && data !== undefined) {
            setAccountUpgrades(data);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchAccountUpgrades();
  }, [txCount, activeNetworkId, address]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
      </div>
      <div className='card-body'>
        {dataReady === undefined && <Loader dataTestId='upgradesLoader' />}
        {dataReady === false && (
          <PageState
            icon={faCode}
            title='Unable to load Contract Upgrades'
            className='py-spacer my-auto'
            dataTestId='errorScreen'
          />
        )}
        {dataReady === true &&
          accountUpgrades &&
          accountUpgrades.length === 0 && (
            <PageState
              icon={faCode}
              title='No Smart Contract Upgrades'
              className='py-spacer my-auto'
            />
          )}
        {dataReady === true &&
          accountUpgrades &&
          accountUpgrades.length > 0 && (
            <div className='table-wrapper animated-list'>
              <table className='table' data-testid='transactionsTable'>
                <thead>
                  <tr>
                    <th scope='col'>Address</th>
                    <th scope='col'>Upgraded</th>
                    <th scope='col'>Upgrade Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {accountUpgrades.map((upgrade) => {
                    return (
                      <tr className='animated-row' key={upgrade.txHash}>
                        <td>
                          <div className='d-flex align-items-center trim-size-xl'>
                            <AccountLink
                              address={upgrade.address}
                              assets={upgrade?.assets}
                            />
                          </div>
                        </td>
                        <td>
                          <TimeAgo value={upgrade.timestamp} tooltip /> ago
                          &nbsp;
                        </td>
                        <td>
                          <div className='d-flex align-items-center trim-size-xl'>
                            <NetworkLink
                              to={`/transactions/${upgrade.txHash}`}
                              data-testid='transactionLink'
                              className='trim-wrapper'
                            >
                              <Trim text={upgrade.txHash} />
                            </NetworkLink>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
};
