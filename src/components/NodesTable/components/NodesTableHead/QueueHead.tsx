import { Sort, NodesGeneralFilter, Overlay } from 'components';

export const QueueHead = ({ hideFilters }: { hideFilters?: boolean }) => {
  return (
    <tr>
      <th data-testid='node'>
        <div className='d-flex align-items-center'>
          {hideFilters ? (
            'Public Key'
          ) : (
            <NodesGeneralFilter text='Public Key' />
          )}
          {!hideFilters && (
            <Overlay title='Sort by Queue Position'>
              <Sort id='position' text='' />
            </Overlay>
          )}
        </div>
      </th>
      <th data-testid='name'>
        <Sort id='name' text='Name' />
      </th>
      <th data-testid='version'>
        <Sort id='version' text='Version' />
      </th>
    </tr>
  );
};
