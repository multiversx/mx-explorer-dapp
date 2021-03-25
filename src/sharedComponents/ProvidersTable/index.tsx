import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { Denominate, NetworkLink, PageState, Trim } from 'sharedComponents';
import IdentityAvatar from 'sharedComponents/SharedIdentity/IdentityAvatar';
import CopyButton from 'sharedComponents/CopyButton';
import DelegationCap from './DelegationCap';
import PercentageFilled, { getPercentageFilled } from './PercentageFilled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/pro-regular-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/pro-regular-svg-icons/faArrowUp';

type SortFieldType =
  | 'filled'
  | 'serviceFee'
  | 'numNodes'
  | 'apr'
  | 'totalActiveStake'
  | 'maxDelegationCap'
  | 'name'
  | undefined;
type SortDirectionType = 'asc' | 'desc' | undefined;
type SortType = [SortFieldType, SortDirectionType];

const CaretIcon = ({ sortDirection }: { sortDirection?: SortDirectionType }) => (
  <FontAwesomeIcon
    icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
    className="sort-icon ml-1"
  />
);

const ProvidersTable = ({
  providers,
  showIdentity = true,
}: {
  providers: types.ProviderType[];
  showIdentity?: boolean;
}) => {
  const [originalProviders /*setOriginalProviders*/] = React.useState<types.ProviderType[]>(
    providers
  );
  const [displayProviders, setDisplayProviders] = React.useState<types.ProviderType[]>(providers);
  const [sort, setSort] = React.useState<SortType>([undefined, undefined]);
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

  const sortProviders = (displayProviders: types.ProviderType[]) => {
    if (sortField) {
      const sortParams = sortDirection === 'asc' ? [1, -1] : [-1, 1];

      switch (true) {
        case sortField === 'name':
          const sortedNames = displayProviders.filter(
            (provider) => provider.identity && provider.identity.name
          );
          const sortedContracts = displayProviders.filter(
            (provider) => !(provider.identity && provider.identity.name)
          );
          sortedNames.sort((a, b) => {
            const aName = a.identity && a.identity.name ? a.identity.name : '';
            const bName = b.identity && b.identity.name ? b.identity.name : '';
            return aName > bName ? sortParams[0] : sortParams[1];
          });
          sortedContracts.sort((a, b) => (a.contract > b.contract ? sortParams[0] : sortParams[1]));
          displayProviders = [...sortedNames, ...sortedContracts];
          break;

        case sortField === 'filled':
          displayProviders.sort((a, b) => {
            let aFilled = getPercentageFilled(a.totalActiveStake, a.maxDelegationCap);
            let bFilled = getPercentageFilled(b.totalActiveStake, b.maxDelegationCap);

            return parseFloat(aFilled) > parseFloat(bFilled) ? sortParams[0] : sortParams[1];
          });
          break;

        default:
          displayProviders.sort((a: any, b: any) =>
            parseFloat(a[sortField]) > parseFloat(b[sortField]) ? sortParams[0] : sortParams[1]
          );
          break;
      }
    }

    return displayProviders;
  };

  React.useEffect(() => {
    if (sortField) {
      setDisplayProviders((existing) => sortProviders([...existing]));
    } else {
      setDisplayProviders(originalProviders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const SortTh = ({ field, name }: { field: SortFieldType; name: string }) => (
    <span className={`sort-col ${sortField === field ? 'active' : ''}`} onClick={onSort(field)}>
      {name}
      {sortField === field && <CaretIcon sortDirection={sortDirection} />}
    </span>
  );

  return (
    <div className="providers-table table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {showIdentity ? (
              <th>
                <SortTh name="Name" field="name" />
              </th>
            ) : (
              <th>Address</th>
            )}
            <th>
              <SortTh name="Stake" field="totalActiveStake" />
            </th>
            <th>
              <SortTh name="Nodes" field="numNodes" />
            </th>
            <th>
              <SortTh name="Computed APR" field="apr" />
            </th>
            <th>
              <SortTh name="Service fee" field="serviceFee" />
            </th>
            <th>
              <SortTh name="Delegation cap" field="maxDelegationCap" />
            </th>
            <th>
              <SortTh name="Filled" field="filled" />
            </th>
          </tr>
        </thead>
        <tbody data-testid="providersTable">
          {displayProviders.map((provider, i) => (
            <tr key={provider.contract}>
              {showIdentity ? (
                <td>
                  <div className="d-flex align-items-center">
                    <IdentityAvatar identity={provider.identity || {}} />

                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.contract)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      {provider.identity && provider.identity.name ? (
                        <>{provider.identity.name}</>
                      ) : (
                        <Trim text={provider.contract} />
                      )}
                    </NetworkLink>
                  </div>
                </td>
              ) : (
                <td>
                  <div className="d-flex align-items-center">
                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.contract)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      <Trim text={provider.contract} />
                    </NetworkLink>
                    <CopyButton text={provider.contract} />
                  </div>
                </td>
              )}
              <td>
                {provider.totalActiveStake ? (
                  <Denominate value={provider.totalActiveStake} />
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
                {provider.serviceFee ? <>{parseInt(provider.serviceFee) / 100}%</> : <>N/A</>}
              </td>
              <td>
                {provider.maxDelegationCap ? (
                  <DelegationCap maxDelegationCap={provider.maxDelegationCap} />
                ) : (
                  <>N/A</>
                )}
              </td>
              <td>
                {provider.totalActiveStake && provider.maxDelegationCap ? (
                  <PercentageFilled
                    totalActiveStake={provider.totalActiveStake}
                    maxDelegationCap={provider.maxDelegationCap}
                  />
                ) : (
                  <>N/A</>
                )}
              </td>
            </tr>
          ))}
          {displayProviders.length === 0 && (
            <tr>
              <td colSpan={showIdentity ? 2 : 1}>
                <PageState
                  icon={faCode}
                  title="No Providers"
                  className="py-spacer my-auto"
                  dataTestId="errorScreen"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProvidersTable;
