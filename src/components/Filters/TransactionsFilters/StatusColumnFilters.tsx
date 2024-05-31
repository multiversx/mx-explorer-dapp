import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter, SearchFilter } from 'components';
import { capitalize } from 'helpers';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { TransactionApiStatusEnum, TransactionFiltersEnum } from 'types';

export const StatusColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const [searchParams] = useSearchParams();
  const { status, miniBlockHash } = Object.fromEntries(searchParams);

  const searchStatuses = (
    Object.keys(
      TransactionApiStatusEnum
    ) as (keyof typeof TransactionApiStatusEnum)[]
  ).map((key) => {
    return {
      value: key,
      label: capitalize(TransactionApiStatusEnum[key])
    };
  });

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.status) &&
    inactiveFilters.includes(TransactionFiltersEnum.miniBlockHash)
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
              {!inactiveFilters.includes(TransactionFiltersEnum.status) && (
                <>
                  {searchStatuses.length > 0 && (
                    <div className='filter-block'>
                      <div className='mb-1'>Status</div>
                      <SelectFilter
                        name='status-filter'
                        options={searchStatuses}
                        filter={TransactionFiltersEnum.status}
                      />
                    </div>
                  )}
                </>
              )}

              {!inactiveFilters.includes(
                TransactionFiltersEnum.miniBlockHash
              ) && (
                <div className='filter-block'>
                  <div className='mb-1'>Miniblock Hash</div>
                  <SearchFilter
                    name='miniBlockHash-filter'
                    filter={TransactionFiltersEnum.miniBlockHash}
                    placeholder='Hash'
                    validation='hash'
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
        data-testid='transactionStatusColumnFilter'
      >
        <FontAwesomeIcon
          icon={
            status !== undefined || miniBlockHash !== undefined
              ? faFilterSolid
              : faFilter
          }
          className={
            status !== undefined || miniBlockHash !== undefined
              ? 'text-primary'
              : ''
          }
        />
      </div>
    </OverlayTrigger>
  );
};
