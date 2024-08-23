import classNames from 'classnames';

import { TableSearch } from 'components';
import { useGetNodeFilters, useGetSearch } from 'hooks';
import { WithClassnameType, NodeStatusEnum, NodeTypeEnum } from 'types';

export interface NodesHeaderUIType extends WithClassnameType {
  searchValue?: string | number;
  smallHeader?: boolean;
}

export const NodesHeader = ({
  searchValue,
  smallHeader,
  className
}: NodesHeaderUIType) => {
  const nodeFilters = useGetNodeFilters();
  const { search } = useGetSearch();
  const { status, type, isAuctioned } = nodeFilters;

  const getNodesFilterTitle = () => {
    if (type === NodeTypeEnum.validator) {
      return 'Validating Nodes';
    }
    if (type === NodeTypeEnum.observer) {
      return 'Observers';
    }
    if (status === NodeStatusEnum.auction || isAuctioned) {
      return 'Auction List';
    }
    if (status === NodeStatusEnum.queued) {
      return 'Queued Nodes';
    }
    if (Object.keys(nodeFilters).length === 0 && !search) {
      return 'All Nodes';
    }
    return 'Nodes';
  };

  const filterTitle = getNodesFilterTitle();

  return (
    <div
      className={classNames(
        'nodes-search d-flex flex-wrap align-items-center justify-content-between gap-3 w-100',
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
        searchValue={searchValue}
        placeholderText={type === NodeTypeEnum.observer ? 'observer' : 'node'}
      />
    </div>
  );
};
