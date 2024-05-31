import {
  NodesGeneralFilter,
  NodesQualifiedFilter,
  Sort,
  ShardFilter
} from 'components';
import { useIsSovereign } from 'hooks';

import { NodesTableFilterHead } from '../NodesTableFilterHead';

export const AuctionHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  const isSovereign = useIsSovereign();
  return (
    <thead>
      <tr>
        <th scope='col' data-testid='node'>
          <NodesGeneralFilter text='Public Key' hideFilters={hideFilters} />
        </th>
        <th scope='col' data-testid='name'>
          <Sort id='name' text='Name' hideFilters={hideFilters} />
        </th>
        <th scope='col' data-testid='shard'>
          <ShardFilter
            text={isSovereign ? 'Chain' : 'Shard'}
            hideFilters={hideFilters}
          />
        </th>
        <th scope='col' data-testid='version'>
          <Sort id='version' text='Version' hideFilters={hideFilters} />
        </th>
        <th scope='col' data-testid='qualifiedStake'>
          <Sort
            id='qualifiedStake'
            text='Qualified Stake / Node'
            hideFilters={hideFilters}
          />
        </th>
        <th scope='col' data-testid='delta'>
          <Sort id='qualifiedStake' text='Delta' hideFilters={hideFilters} />
        </th>
        <th scope='col' data-testid='status'>
          <NodesQualifiedFilter text='Status' hideFilters={hideFilters} />
        </th>
      </tr>
      <NodesTableFilterHead colSpan={7} />
    </thead>
  );
};
