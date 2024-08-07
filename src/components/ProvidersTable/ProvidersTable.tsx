import { useEffect, useState } from 'react';

import { useGetSort } from 'hooks';
import { ProviderType } from 'types';
import { ProvidersTableHead, ProvidersTableBody } from './components';
import { sortProviders, SortProviderFieldEnum } from './helpers';

export interface ProvidersTableUIType {
  providers: ProviderType[];
  showIdentity?: boolean;
  hasExpand?: boolean;
  hideFilters?: boolean;
}

export const ProvidersTable = (props: ProvidersTableUIType) => {
  const { providers } = props;
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
        <ProvidersTableHead {...props} />
        <ProvidersTableBody {...props} providers={displayProviders} />
      </table>
    </div>
  );
};
