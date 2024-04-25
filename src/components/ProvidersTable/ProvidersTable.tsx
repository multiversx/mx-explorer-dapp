import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import {
  CopyButton,
  FormatAmount,
  NetworkLink,
  Overlay,
  LockedStakeTooltip,
  PageState,
  SharedIdentity,
  Sort,
  Trim
} from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import { useGetSort } from 'hooks';
import { faCode } from 'icons/regular';

import { faBadgeCheck } from 'icons/solid';
import { ProviderType } from 'types';
import { DelegationCap, PercentageFilled } from './components';
import { sortProviders, SortProviderFieldEnum } from './helpers';

export const ProvidersTable = ({
  providers,
  showIdentity = true
}: {
  providers: ProviderType[];
  showIdentity?: boolean;
}) => {
  const [displayProviders, setDisplayProviders] =
    useState<ProviderType[]>(providers);
  const sort = useGetSort();

  useEffect(() => {
    if (sort.sort && sort.order) {
      setDisplayProviders((existing) =>
        sortProviders({
          field: sort.sort as SortProviderFieldEnum,
          order: sort.order,
          sortArray: [...existing]
        })
      );
    } else {
      setDisplayProviders(providers);
    }
  }, [sort.sort, sort.order]);

  return (
    <div className='providers-table table-wrapper'>
      <table className='table mb-0'>
        <thead>
          <tr>
            {showIdentity ? (
              <th>
                <Sort text='Name' id='name' />
              </th>
            ) : (
              <th>Address</th>
            )}
            <th>
              <Sort text='Stake' id='locked' />
            </th>
            <th>
              <Sort text='Nodes' id='numNodes' />
            </th>
            <th>
              <Sort text='Computed Net APR' id='apr' />
            </th>
            <th>
              <Sort text='Service fee' id='serviceFee' />
            </th>
            <th>
              <Sort text='Delegation cap' id='delegationCap' />
            </th>
            <th>
              <Sort text='Filled' id='filled' />
            </th>
          </tr>
        </thead>
        <tbody data-testid='providersTable'>
          {displayProviders.map((provider, i) => (
            <tr key={provider.provider}>
              <td>
                <div className='d-flex align-items-center hash hash-lg gap-2'>
                  {showIdentity && (
                    <SharedIdentity.Avatar
                      identity={provider.identityInfo || {}}
                    />
                  )}
                  <NetworkLink
                    to={urlBuilder.providerDetails(provider.provider)}
                    className='trim-wrapper'
                    data-testid={`providerLink${i}`}
                  >
                    {provider.identityInfo?.name && showIdentity ? (
                      <span className='text-truncate'>
                        {provider.identityInfo.name}
                      </span>
                    ) : (
                      <Trim text={provider.provider} />
                    )}
                  </NetworkLink>
                  {showIdentity && provider.featured && (
                    <Overlay title='Verified'>
                      <FontAwesomeIcon
                        icon={faBadgeCheck}
                        size='sm'
                        className='text-primary'
                      />
                    </Overlay>
                  )}
                  {!showIdentity && <CopyButton text={provider.provider} />}
                </div>
              </td>
              <td>
                {provider.locked ? (
                  <Overlay
                    title={
                      <LockedStakeTooltip
                        stake={provider.stake}
                        topUp={provider.topUp}
                      />
                    }
                    tooltipClassName='tooltip-text-start tooltip-lg'
                    truncate
                  >
                    <FormatAmount value={provider.locked} showTooltip={false} />
                  </Overlay>
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.numNodes !== undefined ? (
                  <>
                    {provider.numNodes} node{provider.numNodes !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.apr ? (
                  <>
                    {provider.apr}
                    {provider.apr !== 'N/A' ? '%' : ''}
                  </>
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.serviceFee ? (
                  <>
                    {formatBigNumber({
                      value: new BigNumber(provider.serviceFee).times(100)
                    })}
                    %
                  </>
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.delegationCap ? (
                  <DelegationCap delegationCap={provider.delegationCap} />
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.locked && provider.delegationCap ? (
                  <PercentageFilled
                    locked={provider.locked}
                    delegationCap={provider.delegationCap}
                  />
                ) : (
                  <>N/A</>
                )}
              </td>
            </tr>
          ))}
          {displayProviders.length === 0 && (
            <tr>
              <td colSpan={7}>
                <PageState icon={faCode} title='No Providers' isError />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
