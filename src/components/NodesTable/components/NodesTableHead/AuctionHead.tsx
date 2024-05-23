import {
  NodesGeneralFilter,
  NodesQualifiedFilter,
  Sort,
  ShardFilter
} from 'components';
import { useIsSovereign } from 'hooks';

import { NodesTableFilterHead } from '../NodesTableFilterHead';

export const AuctionHead = () => {
  const isSovereign = useIsSovereign();
  return (
    <thead>
      <tr>
        <th scope='col' data-testid='node'>
          <NodesGeneralFilter text='Public Key' />
        </th>
        <th scope='col' data-testid='name'>
          <Sort id='name' text='Name' />
        </th>
        <th scope='col' data-testid='shard'>
          <ShardFilter text={isSovereign ? 'Chain' : 'Shard'} />
        </th>
        <th scope='col' data-testid='version'>
          <Sort id='version' text='Version' />
        </th>
        <th scope='col' data-testid='qualifiedStake'>
          <Sort id='qualifiedStake' text='Qualified Stake / Node' />
        </th>
        <th scope='col' data-testid='delta'>
          <Sort id='qualifiedStake' text='Delta' />
        </th>
        <th scope='col' data-testid='status'>
          <NodesQualifiedFilter text='Status' />
        </th>
      </tr>
      <NodesTableFilterHead colSpan={7} />
    </thead>
  );
};
