import { TableFiltersHead } from 'components';
import { useGetNodeFilters } from 'hooks';

export const NodesTableFilterHead = ({
  hideFilters,
  colSpan = 12
}: {
  hideFilters?: boolean;
  colSpan?: number;
}) => {
  const filters = useGetNodeFilters();

  return (
    <TableFiltersHead
      filters={filters}
      hideFilters={hideFilters}
      colSpan={colSpan}
      ignoredFilters={['type', 'isAuctioned']}
    />
  );
};
