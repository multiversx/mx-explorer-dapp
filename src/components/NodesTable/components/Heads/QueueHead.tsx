import { Sort } from 'components';

import { StatusFilter } from '../StatusFilter';

export const QueueHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
    <tr>
      <th data-testid='position'>
        <Sort id='position' field='Position' />
      </th>
      <th data-testid='node'>Public key</th>
      <th data-testid='name'>
        <Sort id='name' field='Name' />
      </th>
      <th data-testid='version'>
        <Sort id='version' field='Version' />
      </th>
      <th className='text-end' data-testid='status'>
        Status
        {hideFilters === true ? '' : <StatusFilter />}
      </th>
    </tr>
  );
};
