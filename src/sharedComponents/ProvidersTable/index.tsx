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
  | 'stake'
  | 'delegationCap'
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
            (provider) => provider.identityDetails && provider.identityDetails.name
          );
          const sortedContracts = displayProviders.filter(
            (provider) => !(provider.identityDetails && provider.identityDetails.name)
          );
          sortedNames.sort((a, b) => {
            const aName = a.identityDetails && a.identityDetails.name ? a.identityDetails.name : '';
            const bName = b.identityDetails && b.identityDetails.name ? b.identityDetails.name : '';
            return aName.toLowerCase() > bName.toLowerCase() ? sortParams[0] : sortParams[1];
          });
          sortedContracts.sort((a, b) => (a.provider > b.provider ? sortParams[0] : sortParams[1]));
          displayProviders = [...sortedNames, ...sortedContracts];
          break;

        case sortField === 'filled':
          displayProviders.sort((a, b) => {
            let aFilled = getPercentageFilled(a.stake, a.delegationCap);
            let bFilled = getPercentageFilled(b.stake, b.delegationCap);

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
              <SortTh name="Stake" field="stake" />
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
              <SortTh name="Delegation cap" field="delegationCap" />
            </th>
            <th>
              <SortTh name="Filled" field="filled" />
            </th>
          </tr>
        </thead>
        <tbody data-testid="providersTable">
          {displayProviders.map((provider, i) => (
            <tr key={provider.provider}>
              {showIdentity ? (
                <td>
                  <div className="d-flex align-items-center">
                    <IdentityAvatar identity={provider.identityDetails || {}} />

                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.provider)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      {provider.identityDetails && provider.identityDetails.name ? (
                        <>{provider.identityDetails.name}</>
                      ) : (
                        <Trim text={provider.provider} />
                      )}
                    </NetworkLink>
                  </div>
                </td>
              ) : (
                <td>
                  <div className="d-flex align-items-center">
                    <NetworkLink
                      to={urlBuilder.providerDetails(provider.provider)}
                      className="trim-wrapper"
                      data-testid={`providerLink${i}`}
                    >
                      <Trim text={provider.provider} />
                    </NetworkLink>
                    <CopyButton text={provider.provider} />
                  </div>
                </td>
              )}
              <td>{provider.stake ? <Denominate value={provider.stake} /> : <>N/A</>}</td>
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
                {provider.serviceFee ? <>{(provider.serviceFee * 100).toFixed(2)}%</> : <>N/A</>}
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
