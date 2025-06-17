import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { TableSearch } from 'components';
import { useGetSearch } from 'hooks';

import { ApplicationsFiltersUIType } from './ApplicationsFilters';

export interface ApplicationsHeaderUIType extends ApplicationsFiltersUIType {
  smallHeader?: boolean;
}

export const ApplicationsHeader = ({
  verifiedApplicationsCount,
  applicationsCount,
  smallHeader,
  className
}: ApplicationsHeaderUIType) => {
  const [searchParams] = useSearchParams();
  const { search } = useGetSearch();

  const { isVerified, ...rest } = Object.fromEntries(searchParams);

  const searchValue = isVerified
    ? verifiedApplicationsCount
    : applicationsCount;

  const getApplicationsFilterTitle = () => {
    if (isVerified) {
      return 'Verified Applications';
    }
    if (Object.keys(rest).length === 0 && !search) {
      return 'All Applications';
    }
    return 'Applications';
  };

  const filterTitle = getApplicationsFilterTitle();

  return (
    <div
      className={classNames(
        'applications-search d-flex flex-wrap align-items-center justify-content-between gap-3 w-100',
        className
      )}
    >
      {filterTitle && (
        <h3
          className={classNames('mb-0', { h5: smallHeader })}
          data-testid='title'
        >
          {filterTitle}
        </h3>
      )}
      <TableSearch
        className='input-group-search'
        searchValue={searchValue}
        placeholderText='App'
      />
    </div>
  );
};
