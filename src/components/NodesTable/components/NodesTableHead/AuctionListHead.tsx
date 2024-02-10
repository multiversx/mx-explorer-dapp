import { Sort } from 'components';

export const AuctionListHead = () => {
  return (
    <tr>
      <th className='th-rank'>
        <Sort id='position' field='Position' />
      </th>
      <th className='th-eligibility'>Qualified</th>
      <th className='th-identity'>
        <Sort id='name' field='Validator' />
      </th>
      <th className='th-key'>Key</th>
      <th className='th-stake'>
        <Sort id='locked' field='Stake / Node' />
      </th>
      <th className='th-treshold'>Until Treshold</th>
      <th className='th-info'></th>
    </tr>
  );
};
