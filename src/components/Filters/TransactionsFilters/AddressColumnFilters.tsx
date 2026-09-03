import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SearchFilter } from 'components';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { TransactionFiltersEnum } from 'types';

export const AddressColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const [searchParams] = useSearchParams();
  const { address } = Object.fromEntries(searchParams);

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.address)
  ) {
    return null;
  }

  return (
    <OverlayTrigger
      trigger='click'
      key='popover'
      placement='bottom'
      rootClose
      overlay={
        <Popover id='popover-positioned-bottom' className='border popover-xs '>
          <Popover.Body>
            <div className='p-3 '>
              <div className='filter-block'>
                <div className='mb-1'>Address</div>
                <SearchFilter
                  name='address-filter'
                  filter={TransactionFiltersEnum.address}
                  placeholder='Address'
                  validation='address-or-metachain'
                />
              </div>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='addressColumnFilter'
      >
        <FontAwesomeIcon
          icon={address !== undefined ? faFilterSolid : faFilter}
          className={address !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
