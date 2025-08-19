import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter } from 'components';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { TransactionEventIdentifiersEnum } from 'types';

export const IdentifierColumnFilters = () => {
  const [searchParams] = useSearchParams();
  const { identifier: filteredIdentifier } = Object.fromEntries(searchParams);

  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  const searchIdentifiers = (
    Object.values(
      TransactionEventIdentifiersEnum
    ) as (keyof typeof TransactionEventIdentifiersEnum)[]
  )
    .filter((val, index, array) => array.indexOf(val) === index)
    .map((key) => {
      return {
        value: key,
        label: capitalize(TransactionEventIdentifiersEnum[key])
      };
    });

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
              {searchIdentifiers.length > 0 && (
                <div className='filter-block'>
                  <div className='mb-1'>Identifier</div>
                  <SelectFilter
                    name='identifier-filter'
                    options={searchIdentifiers}
                    filter='identifier'
                    placeholder='Search'
                    hasCustomSearch
                  />
                </div>
              )}
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='identifierColumnFilter'
      >
        <FontAwesomeIcon
          icon={filteredIdentifier !== undefined ? faFilterSolid : faFilter}
          className={filteredIdentifier !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
