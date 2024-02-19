import { Sort, StatusFilter } from 'components';

export const QueueHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
    <tr>
      <th data-testid='position'>
        <Sort id='position' field='Position' />
      </th>
      <th data-testid='node'>Public Key</th>
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
