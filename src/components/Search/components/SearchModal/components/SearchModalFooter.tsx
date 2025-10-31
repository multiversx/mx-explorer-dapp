import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from 'icons/regular';

export const SearchModalFooter = () => {
  return (
    <div className='search-modal-footer'>
      <div className='key-action'>
        <div className='key-text'>Close</div>
        <div className='key-hint'>ESC</div>
      </div>
      <div className='key-separator' />
      <div className='key-action'>
        <div className='key-text'>Open</div>
        <div className='key-hint'>/</div>
      </div>
      <div className='key-separator' />
      <div className='key-action'>
        <div className='key-text'>Navigate</div>
        <div className='key-hint'>
          <FontAwesomeIcon icon={faArrowUp} size='sm' />
        </div>
        <div className='key-hint'>
          <FontAwesomeIcon icon={faArrowDown} size='sm' />
        </div>
      </div>
      <div className='key-separator' />
      <div className='key-action'>
        <div className='key-text'>Select</div>
        <div className='key-hint'>Enter</div>
      </div>
    </div>
  );
};
