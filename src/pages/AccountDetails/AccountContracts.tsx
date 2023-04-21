import React, { useEffect, useRef, useState } from 'react';
import { faCode } from '@fortawesome/pro-solid-svg-icons/faCode';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Loader,
  Pager,
  PageState,
  NetworkLink,
  TimeAgo,
  Trim,
  AccountLink
} from 'components';
import { useGetPage, useAdapter } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { AccountSmartContractType } from 'types';

import { AccountTabs } from './AccountLayout/AccountTabs';

export const AccountContracts = () => {
  const ref = useRef(null);

  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { txCount } = account;
  const { page } = useGetPage();

  const { getAccountContracts, getAccountContractsCount } = useAdapter();

  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountContracts, setAccountContracts] = useState<
    AccountSmartContractType[]
  >([]);
  const [accountContractsCount, setAccountContractsCount] = useState(0);

  const fetchAccountContracts = () => {
    Promise.all([
      getAccountContracts({
        page,
        address
      }),
      getAccountContractsCount(address)
    ]).then(([accountContractsData, accountContractsCountData]) => {
      if (ref.current !== null) {
        if (accountContractsData.success && accountContractsCountData.success) {
          setAccountContracts(accountContractsData.data);
          setAccountContractsCount(accountContractsCountData.data);
        }
        setDataReady(
          accountContractsData.success && accountContractsCountData.success
        );
      }
    });
  };

  useEffect(() => {
    fetchAccountContracts();
  }, [txCount, activeNetworkId, address, searchParams]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          {dataReady === true && accountContracts.length > 0 && (
            <Pager
              total={accountContractsCount}
              show={accountContracts.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          )}
        </div>
      </div>
      <div className='card-body'>
        {dataReady === undefined && <Loader dataTestId='contractsLoader' />}
        {dataReady === false && (
          <PageState
            icon={faCode}
            title='Unable to load Smart Contracts'
            className='py-spacer my-auto'
            dataTestId='errorScreen'
          />
        )}
        {dataReady === true && accountContracts.length === 0 && (
          <PageState
            icon={faCode}
            title='No Smart Contracts'
            className='py-spacer my-auto'
          />
        )}
        {dataReady === true && accountContracts.length > 0 && (
          <div className='table-wrapper animated-list'>
            <table className='table' data-testid='transactionsTable'>
              <thead>
                <tr>
                  <th scope='col'>Address</th>
                  <th scope='col'>Deployed</th>
                  <th scope='col'>Deploy Transaction</th>
                </tr>
              </thead>
              <tbody>
                {accountContracts.map((contract) => {
                  return (
                    <tr className='animated-row' key={contract.deployTxHash}>
                      <td>
                        <div className='d-flex align-items-center trim-size-xl'>
                          <AccountLink
                            address={contract.address}
                            assets={contract?.assets}
                          />
                        </div>
                      </td>
                      <td>
                        <TimeAgo value={contract.timestamp} tooltip /> ago
                        &nbsp;
                      </td>
                      <td>
                        <div className='d-flex align-items-center trim-size-xl'>
                          <NetworkLink
                            to={`/transactions/${contract.deployTxHash}`}
                            data-testid='transactionLink'
                            className='trim-wrapper'
                          >
                            <Trim text={contract.deployTxHash} />
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
      {dataReady === true && accountContracts.length > 0 && (
        <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
          <Pager
            total={accountContractsCount}
            show={accountContracts.length > 0}
          />
        </div>
      )}
    </div>
  );
};
