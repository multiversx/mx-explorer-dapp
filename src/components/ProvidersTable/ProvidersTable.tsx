import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { useGetSort } from 'hooks';
import { ProviderType } from 'types';
import { ProvidersTableHead, ProvidersTableBody } from './components';
import { sortProviders, SortProviderFieldEnum } from './helpers';

export interface ProvidersTableUIType {
  providers: ProviderType[];
  showIdentity?: boolean;
  showIndex?: boolean;
  hasExpand?: boolean;
  hideFilters?: boolean;
}

export const ProvidersTable = (props: ProvidersTableUIType) => {
  const { providers, showIndex = true, showIdentity = true } = props;
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
    <div
      className={classNames('providers-table table-wrapper', {
        'show-index': showIndex,
        'show-identity': showIdentity
      })}
    >
      <table className='table mb-0'>
        <ProvidersTableHead {...props} />
        <ProvidersTableBody {...props} providers={displayProviders} />
      </table>
    </div>
  );
};
