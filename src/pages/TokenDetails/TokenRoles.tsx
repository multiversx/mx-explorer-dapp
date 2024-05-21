import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { Loader, AccountLink } from 'components';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { tokenSelector } from 'redux/selectors';

export const TokenDetailsRoles = () => {
  const ref = useRef(null);

  const { token } = useSelector(tokenSelector);
  const { roles } = token;

  return (
    <div ref={ref}>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <TokenTabs />
          </div>
        </div>
        {roles ? (
          <>
            <div className='card-body'>
              <div className='table-wrapper animated-list'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Roles</th>
                    </tr>
                  </thead>
                  <tbody data-testid='tokenRolesTable'>
                    {roles.map((tokenRole, i) => (
                      <tr key={`${tokenRole?.address}-${i}`}>
                        <td>
                          <div className='d-flex align-items-center'>
                            {tokenRole?.address ? (
                              <AccountLink
                                address={tokenRole.address}
                                assets={tokenRole?.assets}
                                className='full-hash'
                                linkClassName='trim-only-sm'
                              />
                            ) : (
                              <>Anyone</>
                            )}
                          </div>
                        </td>
                        <td>
                          {tokenRole.roles.map((role, index) => (
                            <div
                              className='badge badge-outline badge-outline-grey me-2'
                              key={`${tokenRole.address}-${index}`}
                            >
                              {role}
                            </div>
                          ))}
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
            {roles === undefined && <Loader data-testid='tokenRolesLoader' />}
          </>
        )}
      </div>
    </div>
  );
};
