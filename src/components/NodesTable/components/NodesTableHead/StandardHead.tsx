import { Sort, QualifiedFilter, ShardFilter, StatusFilter } from 'components';
import { NodeType } from 'types';

export const StandardHead = ({
  hideFilters,
  type,
  status
}: {
  hideFilters?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
}) => (
  <tr>
    {status === 'queued' && (
      <th data-testid='position'>
        <Sort id='position' field='Position' />
      </th>
    )}
    {status === 'auction' && <th data-testid='auctionPosition'>Position</th>}
    <th data-testid='node'>Public Key</th>
    <th data-testid='name'>
      <Sort id='name' field='Name' />
    </th>
    <th data-testid='shard'>Shard{hideFilters ? '' : <ShardFilter />}</th>
    <th data-testid='version'>
      <Sort id='version' field='Version' />
    </th>
    {status !== 'auction' && (
      <th
        className='text-end'
        data-testid='validatorIgnoredSignatures'
        style={{ maxWidth: '8rem' }}
      >
        <Sort id='validatorIgnoredSignatures' field='Ignored Signatures' />
      </th>
    )}
    <th className='text-end' data-testid='status'>
      Status
      {hideFilters ? '' : <StatusFilter />}
    </th>
    {status === 'auction' && (
      <th className='text-end' data-testid='qualified'>
        Qualified
        {hideFilters ? '' : <QualifiedFilter />}
      </th>
    )}
    {(type === 'validator' || status === 'auction') && (
      <th className='text-end' data-testid='lockedStake'>
        <Sort id='locked' field='Locked Stake' />
      </th>
    )}
    <th className='text-end' data-testid='tempRating'>
      <Sort id='tempRating' field='Rating' />
    </th>
    <th className='text-end' data-testid='nonce'>
      Nonce
    </th>
  </tr>
);
