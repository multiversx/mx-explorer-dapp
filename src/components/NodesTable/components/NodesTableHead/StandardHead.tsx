import { Sort } from 'components';
import { NodeType } from 'types';

import { ShardFilter } from '../ShardFilter';
import { StatusFilter } from '../StatusFilter';

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
    <th data-testid='node'>Public Key</th>
    <th data-testid='name'>
      <Sort id='name' field='Name' />
    </th>
    <th data-testid='shard'>
      Shard{hideFilters === true ? '' : <ShardFilter />}
    </th>
    <th data-testid='version'>
      <Sort id='version' field='Version' />
    </th>
    <th
      className='text-end'
      data-testid='validatorIgnoredSignatures'
      style={{ maxWidth: '8rem' }}
    >
      <Sort id='validatorIgnoredSignatures' field='Ignored Signatures' />
    </th>
    <th className='text-end' data-testid='status'>
      Status
      {hideFilters === true ? '' : <StatusFilter />}
    </th>
    <th className='text-end' data-testid='tempRating'>
      <Sort id='tempRating' field='Rating' />
    </th>
    <th className='text-end' data-testid='nonce'>
      Nonce
    </th>
    {status === 'queued' && (
      <th className='text-end' data-testid='position'>
        <Sort id='position' field='Position' />
      </th>
    )}
    {type === 'validator' && (
      <th className='text-end' data-testid='lockedStake'>
        <Sort id='locked' field='Locked Stake' />
      </th>
    )}
  </tr>
);
