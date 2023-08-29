import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  Loader,
  PageState,
  CollectionLink,
  TokenLink,
  Pager
} from 'components';
import { capitalize } from 'helpers';
import { useAdapter } from 'hooks';
import { faCode } from 'icons/solid';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import {
  AccountTokenRolesType,
  AccountCollectionRolesType,
  AccountRolesTypeEnum,
  TokenType,
  CollectionType
} from 'types';

export const AccountRoles = ({ type }: { type: AccountRolesTypeEnum }) => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { txCount } = account;

  const { getAccountRoles, getAccountRolesCount } = useAdapter();
  const { hash: address } = useParams() as any;

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [accountRolesTokens, setAccountRolesTokens] = React.useState<
    AccountTokenRolesType[] | AccountCollectionRolesType[]
  >([]);
  const [accountRolesTokensCount, setAccountRolesTokensCount] = useState(0);

  const fetchAccountRoles = () => {
    if (address) {
      Promise.all([
        getAccountRoles({ address, type }),
        getAccountRolesCount({ address, type })
      ]).then(([accountTokenRolesData, accountTokenRolesCountData]) => {
        if (ref.current !== null) {
          if (
            accountTokenRolesData.success &&
            accountTokenRolesCountData.success
          ) {
            setAccountRolesTokens(accountTokenRolesData.data);
            setAccountRolesTokensCount(accountTokenRolesCountData.data);
          }
          setDataReady(
            accountTokenRolesData.success && accountTokenRolesCountData.success
          );
        }
      });
    }
  };

  useEffect(() => {
    fetchAccountRoles();
  }, [txCount, activeNetworkId, address]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          {dataReady === true && accountRolesTokens.length > 0 && (
            <Pager
              total={accountRolesTokensCount}
              show={accountRolesTokens.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          )}
        </div>
      </div>
      <div className='card-body'>
        {dataReady === undefined && <Loader dataTestId='upgradesLoader' />}
        {dataReady === false && (
          <PageState
            icon={faCode}
            title={`Unable to load ${capitalize(type)} Roles`}
            className='py-spacer my-auto'
            dataTestId='errorScreen'
          />
        )}
        {dataReady === true &&
          accountRolesTokens &&
          accountRolesTokens.length === 0 && (
            <PageState
              icon={faCode}
              title={`No ${capitalize(type)} Roles`}
              className='py-spacer my-auto'
            />
          )}
        {dataReady === true &&
          accountRolesTokens &&
          accountRolesTokens.length > 0 && (
            <div className='table-wrapper animated-list'>
              <table className='table' data-testid='transactionsTable'>
                <thead>
                  <tr>
                    <th scope='col'>{capitalize(type)}</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {accountRolesTokens.map((accountRoleToken, index) => {
                    return (
                      <tr className='animated-row' key={`role-${index}`}>
                        <td>
                          <div className='d-flex align-items-center'>
                            {type === AccountRolesTypeEnum.collections && (
                              <CollectionLink
                                collection={accountRoleToken as CollectionType}
                              />
                            )}
                            {type === AccountRolesTypeEnum.tokens && (
                              <TokenLink
                                token={accountRoleToken as TokenType}
                              />
                            )}
                          </div>
                        </td>
                        <td>{accountRoleToken?.name}</td>
                        <td>
                          {accountRoleToken?.role?.roles?.map((role, index) => (
                            <div
                              className='badge badge-outline badge-outline-grey me-2'
                              key={`${role}-${index}`}
                            >
                              {role}
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
      {dataReady === true && accountRolesTokens.length > 0 && (
        <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
          <Pager
            total={accountRolesTokensCount}
            show={accountRolesTokens.length > 0}
          />
        </div>
      )}
    </div>
  );
};
