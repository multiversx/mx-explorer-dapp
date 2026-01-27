import { useSelector } from 'react-redux';

import { BlockGasUsed, NetworkLink, Trim } from 'components';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';

export const SearchBlockRow = () => {
  const { search } = useSelector(searchSelector);
  const { block } = search;

  if (!block) {
    return null;
  }

  return (
    <>
      <div className='search-category'>
        Block Hash<div className='ms-auto'>Gas Used</div>
      </div>
      <NetworkLink
        to={urlBuilder.blockDetails(block.hash)}
        className='search-suggestion selectable'
      >
        <div className='search-text'>
          <div className='hash trim text-truncate'>
            <Trim text={block.hash} />
          </div>
        </div>
        <div className='ms-auto d-flex flex-column align-items-end'>
          <BlockGasUsed block={block} />
        </div>
      </NetworkLink>
    </>
  );
};
