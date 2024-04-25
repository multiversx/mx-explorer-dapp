import { Sort, StatusFilter } from 'components';

export const QueueHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
    <tr>
      <th data-testid='position'>
        <Sort id='position' text='Position' />
      </th>
      <th data-testid='node'>Public Key</th>
      <th data-testid='name'>
        <Sort id='name' text='Name' />
      </th>
      <th data-testid='version'>
        <Sort id='version' text='Version' />
      </th>
      <th className='text-end' data-testid='status'>
        {hideFilters ? 'Status' : <StatusFilter text='Status' />}
      </th>
    </tr>
  );
};
