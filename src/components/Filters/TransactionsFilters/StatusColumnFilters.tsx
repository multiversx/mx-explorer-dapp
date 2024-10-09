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
  const { status, miniBlockHash, relayer, isRelayed } =
    Object.fromEntries(searchParams);

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

  const relayedOptions = [{ value: 'true', label: 'Relayed' }];

  const allInactive = [
    TransactionFiltersEnum.status,
    TransactionFiltersEnum.miniBlockHash,
    TransactionFiltersEnum.relayer,
    TransactionFiltersEnum.isRelayed
  ].every((filter) => inactiveFilters.includes(filter));

  const isActive =
    status !== undefined ||
    miniBlockHash !== undefined ||
    relayer !== undefined ||
    isRelayed !== undefined;

  if (allInactive) {
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

              {!inactiveFilters.includes(TransactionFiltersEnum.isRelayed) && (
                <div className='filter-block'>
                  <div className='mb-1'>Relayed</div>
                  <SelectFilter
                    name='is-relayed-filter'
                    options={relayedOptions}
                    filter={TransactionFiltersEnum.isRelayed}
                  />
                </div>
              )}

              {!inactiveFilters.includes(TransactionFiltersEnum.relayer) && (
                <div className='filter-block'>
                  <div className='mb-1'>Relayer</div>
                  <SearchFilter
                    name='relayer-filter'
                    filter={TransactionFiltersEnum.relayer}
                    placeholder='Relayer'
                    validation='address'
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
          icon={isActive ? faFilterSolid : faFilter}
          className={isActive ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
