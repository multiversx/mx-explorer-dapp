import { Sort } from 'components';
import { SortOrderEnum } from 'types';

import { SortProviderFieldEnum } from '../helpers';
import { ProvidersTableUIType } from '../ProvidersTable';

export const ProvidersTableHead = ({
  showIdentity = true,
  hideFilters
}: ProvidersTableUIType) => {
  return (
    <thead>
      <tr>
        <th>#</th>
        {showIdentity ? (
          <th>
            <Sort
              text='Name'
              id={SortProviderFieldEnum.name}
              hideFilters={hideFilters}
            />
          </th>
        ) : (
          <th>Address</th>
        )}
        <th>
          <Sort
            text='Stake'
            id={SortProviderFieldEnum.locked}
            hideFilters={hideFilters}
          />
        </th>
        <th>
          <Sort
            text='Nodes'
            id={SortProviderFieldEnum.numNodes}
            hideFilters={hideFilters}
            defaultOrder={SortOrderEnum.desc}
            defaultActive
          />
        </th>
        <th className='text-center'>
          <Sort
            text='Computed Net APR'
            id={SortProviderFieldEnum.apr}
            hideFilters={hideFilters}
          />
        </th>
        <th>
          <Sort
            text='Service fee'
            id={SortProviderFieldEnum.serviceFee}
            hideFilters={hideFilters}
          />
        </th>
        <th>
          <Sort
            text='Delegation cap'
            id={SortProviderFieldEnum.delegationCap}
            hideFilters={hideFilters}
          />
        </th>
        <th>
          <Sort
            text='Filled'
            id={SortProviderFieldEnum.filled}
            hideFilters={hideFilters}
          />
        </th>
      </tr>
    </thead>
  );
};
