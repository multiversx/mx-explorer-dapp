import { Sort, QualifiedFilter, ShardFilter, StatusFilter } from 'components';
import { NodeType } from 'types';

export interface StandardHeadUIType {
  hideFilters?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
  showPosition?: boolean;
}

export const StandardHead = ({
  type,
  status,
  hideFilters,
  showPosition
}: StandardHeadUIType) => (
  <tr>
    {status === 'queued' && (
      <th data-testid='position'>
        {hideFilters ? 'Position' : <Sort id='position' text='Position' />}
      </th>
    )}
    {status === 'auction' && showPosition && (
      <th data-testid='auctionPosition'>#</th>
    )}
    <th data-testid='node'>Public Key</th>
    <th data-testid='name'>
      {hideFilters ? 'Name' : <Sort id='name' text='Name' />}
    </th>
    <th data-testid='shard'>
      {hideFilters ? 'Shard' : <ShardFilter text='Shard' />}
    </th>
    <th data-testid='version'>
      {hideFilters ? 'Version' : <Sort id='version' text='Version' />}
    </th>
    {status !== 'auction' && (
      <th
        className='text-end'
        data-testid='validatorIgnoredSignatures'
        style={{ maxWidth: '8rem' }}
      >
        {hideFilters ? (
          'X Sign.'
        ) : (
          <Sort id='validatorIgnoredSignatures' text='X Sign.' />
        )}
      </th>
    )}
    <th className='text-end' data-testid='status'>
      {hideFilters ? 'Status' : <StatusFilter text='Status' />}
    </th>
    {status === 'auction' && (
      <th className='text-end' data-testid='qualified'>
        {hideFilters ? 'Qualified' : <QualifiedFilter text='Qualified' />}
      </th>
    )}
    {(type === 'validator' || status === 'auction') && (
      <th className='text-end' data-testid='lockedStake'>
        {hideFilters ? (
          'Locked Stake'
        ) : (
          <Sort id='locked' text='Locked Stake' />
        )}
      </th>
    )}
    <th className='text-end' data-testid='tempRating'>
      {hideFilters ? 'Rating' : <Sort id='tempRating' text='Rating' />}
    </th>
    <th className='text-end' data-testid='nonce'>
      Nonce
    </th>
  </tr>
);
