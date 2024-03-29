import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  CopyButton,
  Denominate,
  NetworkLink,
  PageState,
  Trim
} from 'components';
import { IdentityAvatar } from 'components/SharedIdentity/IdentityAvatar';
import { urlBuilder } from 'helpers';
import { faArrowDown, faArrowUp, faCode } from 'icons/regular';
import { faBadgeCheck } from 'icons/solid';
import { ProviderType } from 'types';

import { DelegationCap } from './components/DelegationCap';
import {
  PercentageFilled,
  getPercentageFilled
} from './components/PercentageFilled';

type SortFieldType =
  | 'filled'
  | 'serviceFee'
  | 'numNodes'
  | 'apr'
  | 'locked'
  | 'delegationCap'
  | 'name'
  | undefined;
type SortDirectionType = 'asc' | 'desc' | undefined;
type SortType = [SortFieldType, SortDirectionType];

const CaretIcon = ({
  sortDirection
}: {
  sortDirection?: SortDirectionType;
}) => (
  <FontAwesomeIcon
    icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
    className='sort-icon ms-1'
  />
);

export const ProvidersTable = ({
  providers,
  showIdentity = true
}: {
  providers: ProviderType[];
  showIdentity?: boolean;
}) => {
  const [originalProviders /*setOriginalProviders*/] =
    useState<ProviderType[]>(providers);
  const [displayProviders, setDisplayProviders] =
    useState<ProviderType[]>(providers);
  const [sort, setSort] = useState<SortType>([undefined, undefined]);
  const [sortField, sortDirection] = sort;

  const onSort = (field: SortFieldType) => () => {
    setSort(([existingField, existingDirection]) => {
      let newDirection: SortDirectionType = 'asc';
      if (existingField === field) {
        switch (existingDirection) {
          case 'asc':
            newDirection = 'desc';
            break;
          case 'desc':
            newDirection = undefined;
            break;
        }
      }
      return existingField === field && existingDirection === 'desc'
        ? [undefined, newDirection]
        : [field, newDirection];
    });
  };

  const sortProviders = (displayProviders: ProviderType[]) => {
    if (sortField) {
      const sortParams = sortDirection === 'asc' ? [1, -1] : [-1, 1];

      switch (true) {
        case sortField === 'name':
          const sortedNames = displayProviders.filter(
            (provider) =>
              provider.identityDetails && provider.identityDetails.name
          );
          const sortedContracts = displayProviders.filter(
            (provider) =>
              !(provider.identityDetails && provider.identityDetails.name)
          );
          sortedNames.sort((a, b) => {
            const aName =
              a.identityDetails && a.identityDetails.name
                ? a.identityDetails.name
                : '';
            const bName =
              b.identityDetails && b.identityDetails.name
                ? b.identityDetails.name
                : '';
            return aName.toLowerCase() > bName.toLowerCase()
              ? sortParams[0]
              : sortParams[1];
          });
          sortedContracts.sort((a, b) =>
            a.provider > b.provider ? sortParams[0] : sortParams[1]
          );
          displayProviders = [...sortedNames, ...sortedContracts];
          break;

        case sortField === 'filled':
          displayProviders.sort((a, b) => {
            const aFilled = getPercentageFilled(a.locked, a.delegationCap);
            const bFilled = getPercentageFilled(b.locked, b.delegationCap);
            return parseFloat(aFilled) > parseFloat(bFilled)
              ? sortParams[0]
              : sortParams[1];
          });
          break;

        case sortField === 'serviceFee':
          displayProviders.sort((a, b) => {
            const aFee = a.serviceFee ? a.serviceFee : -1;
            const bFee = b.serviceFee ? b.serviceFee : -1;
            return aFee > bFee ? sortParams[0] : sortParams[1];
          });
          break;

        default:
          displayProviders.sort((a: any, b: any) =>
            parseFloat(a[sortField]) > parseFloat(b[sortField])
              ? sortParams[0]
              : sortParams[1]
          );
          break;
      }
    }

    return displayProviders;
  };

  useEffect(() => {
    if (sortField) {
      setDisplayProviders((existing) => sortProviders([...existing]));
    } else {
      setDisplayProviders(originalProviders);
    }
  }, [sort]);

  const SortTh = ({ field, name }: { field: SortFieldType; name: string }) => (
    <span
      className={`sort-col ${sortField === field ? 'active' : ''}`}
      onClick={onSort(field)}
    >
      {name}
      {sortField === field && <CaretIcon sortDirection={sortDirection} />}
    </span>
  );

  return (
    <div className='providers-table table-wrapper'>
      <table className='table mb-0'>
        <thead>
          <tr>
            {showIdentity ? (
              <th>
                <SortTh name='Name' field='name' />
              </th>
            ) : (
              <th>Address</th>
            )}
            <th>
              <SortTh name='Stake' field='locked' />
            </th>
            <th>
              <SortTh name='Nodes' field='numNodes' />
            </th>
            <th>
              <SortTh name='Computed Net APR' field='apr' />
            </th>
            <th>
              <SortTh name='Service fee' field='serviceFee' />
            </th>
            <th>
              <SortTh name='Delegation cap' field='delegationCap' />
            </th>
            <th>
              <SortTh name='Filled' field='filled' />
            </th>
          </tr>
        </thead>
        <tbody data-testid='providersTable'>
          {displayProviders.map((provider, i) => (
            <tr key={provider.provider}>
              {showIdentity ? (
                <td>
                  <div className='d-flex align-items-center hash-lg'>
                    <IdentityAvatar identity={provider.identityDetails || {}} />
                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.provider)}
                      className='trim-wrapper'
                      data-testid={`providerLink${i}`}
                    >
                      {provider.identityDetails &&
                      provider.identityDetails.name ? (
                        <span className='text-truncate'>
                          {provider.identityDetails.name}
                        </span>
                      ) : (
                        <Trim text={provider.provider} />
                      )}
                    </NetworkLink>
                    {provider.featured && (
                      <OverlayTrigger
                        placement='top'
                        delay={{ show: 0, hide: 400 }}
                        overlay={(props: any) => (
                          <Tooltip {...props} show={props.show.toString()}>
                            Verified
                          </Tooltip>
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faBadgeCheck}
                          size='sm'
                          className='ms-2 text-primary'
                        />
                      </OverlayTrigger>
                    )}
                  </div>
                </td>
              ) : (
                <td>
                  <div className='d-flex align-items-center hash-lg'>
                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.provider)}
                      className='trim-wrapper'
                      data-testid={`providerLink${i}`}
                    >
                      <Trim text={provider.provider} />
                    </NetworkLink>
                    <CopyButton text={provider.provider} />
                  </div>
                </td>
              )}
              <td>
                {provider.locked ? (
                  <Denominate value={provider.locked} />
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
                    {(provider.serviceFee * 100).toFixed(2).replace('.00', '')}%
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
                <PageState
                  icon={faCode}
                  title='No Providers'
                  className='py-spacer my-auto'
                  dataTestId='errorScreen'
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
