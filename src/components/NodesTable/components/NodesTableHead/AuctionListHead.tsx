import { Sort } from 'components';

export interface AuctionListHeadUIType {
  showPosition?: boolean;
}

export const AuctionListHead = ({
  showPosition = true
}: AuctionListHeadUIType) => {
  return (
    <tr>
      {showPosition && <th className='th-rank'>#</th>}
      <th className='th-eligibility'>Identity</th>
      <th className='th-identity'>Auction List Nodes</th>
      <th className='th-dropped'>Dropped</th>
      <th className='th-qualified'>Qualified</th>
      <th className='th-stake'>Qualified Stake / Node</th>
      <th className='th-info'>Delta</th>
    </tr>
  );
};
