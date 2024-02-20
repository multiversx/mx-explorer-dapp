import { Sort } from 'components';

export interface AuctionListHeadUIType {
  showPosition?: boolean;
}

export const AuctionListHead = ({ showPosition }: AuctionListHeadUIType) => {
  return (
    <tr>
      {showPosition && <th className='th-rank'>#</th>}
      <th className='th-eligibility'>Qualified</th>
      <th className='th-identity'>
        <Sort id='name' field='Validator' />
      </th>
      <th className='th-key'>Public Key</th>
      <th className='th-stake'>
        <Sort id='locked' field='Stake / Node' />
      </th>
      <th className='th-treshold'>Above Treshold</th>
      <th className='th-info'></th>
    </tr>
  );
};
