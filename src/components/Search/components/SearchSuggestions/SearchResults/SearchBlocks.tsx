import { useSelector } from 'react-redux';

import { BlockGasUsed } from 'components/BlockGasUsed';
import { NetworkLink } from 'components/Links';
import { Trim } from 'components/Trim';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';

export const SearchBlocks = () => {
  const { search } = useSelector(searchSelector);
  const { block, miniblock } = search;

  if (!(block || miniblock)) {
    return null;
  }
  const BlockRow = () => {
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

  const MiniBlockRow = () => {
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

  return (
    <div className='search-group search-block'>
      <BlockRow />
      <MiniBlockRow />
    </div>
  );
};
