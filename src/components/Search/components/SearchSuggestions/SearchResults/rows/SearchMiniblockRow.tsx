import { useSelector } from 'react-redux';

import { NetworkLink, Trim } from 'components';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';

export const SearchMiniblockRow = () => {
  const { search } = useSelector(searchSelector);
  const { miniblock } = search;

  if (!miniblock) {
    return null;
  }
  return (
    <>
      <div className='search-category'>
        MiniBlock Hash<div className='ms-auto'>Type</div>
      </div>
      <NetworkLink
        to={urlBuilder.miniblockDetails(miniblock.miniBlockHash)}
        className='search-suggestion selectable'
      >
        <div className='search-text'>
          <div className='hash trim text-truncate'>
            <Trim text={miniblock.miniBlockHash} />
          </div>
        </div>
        <div className='ms-auto'>
          <span className='badge badge-outline badge-outline-primary-alt'>
            <div className='transaction-function-badge text-truncate text-capitalize'>
              {miniblock.type}
            </div>
          </span>
        </div>
      </NetworkLink>
    </>
  );
};
