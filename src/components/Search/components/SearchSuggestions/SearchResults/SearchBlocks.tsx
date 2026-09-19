import { useSelector } from 'react-redux';

import { searchSelector } from 'redux/selectors';
import { SearchBlockRow } from './rows/SearchBlockRow';
import { SearchMiniblockRow } from './rows/SearchMiniblockRow';

export const SearchBlocks = () => {
  const { search } = useSelector(searchSelector);
  const { block, miniblock } = search;

  if (!(block || miniblock)) {
    return null;
  }

  return (
    <div className='search-group search-block'>
      <SearchBlockRow />
      <SearchMiniblockRow />
    </div>
  );
};
