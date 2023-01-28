import React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter } from 'components';
import { shardSpanText } from 'components/ShardSpan';
import { useFetchShards } from 'hooks';
import { shardsSelector } from 'redux/selectors';
import { TxFiltersEnum, TransactionsTableType } from 'types';

export const ShardColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const [searchParams] = useSearchParams();
  const { senderShard, receiverShard } = Object.fromEntries(searchParams);

  const stateShards = useSelector(shardsSelector);

  useFetchShards();

  const selectShards = stateShards.map((shard) => {
    return {
      value: shard.shard.toString(),
      label: shardSpanText(shard.shard.toString())
    };
  });

  if (
    inactiveFilters &&
    inactiveFilters.includes(TxFiltersEnum.senderShard) &&
    inactiveFilters.includes(TxFiltersEnum.receiverShard)
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
          {stateShards.length > 0 && (
            <Popover.Body>
              <div className='p-3 '>
                {!inactiveFilters.includes(TxFiltersEnum.senderShard) && (
                  <div className='filter-block'>
                    <div className='mb-1'>Sender Shard</div>
                    <SelectFilter
                      name='senderShard-filter'
                      options={selectShards}
                      filter={TxFiltersEnum.senderShard}
                    />
                  </div>
                )}

                {!inactiveFilters.includes(TxFiltersEnum.receiverShard) && (
                  <div className='filter-block'>
                    <div className='mb-1'>Receiver Shard</div>
                    <SelectFilter
                      name='receiverShard-filter'
                      options={selectShards}
                      filter={TxFiltersEnum.receiverShard}
                    />
                  </div>
                )}
              </div>
            </Popover.Body>
          )}
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='shardFilterButton'
      >
        <FontAwesomeIcon
          icon={
            senderShard !== undefined || receiverShard !== undefined
              ? faFilterSolid
              : faFilter
          }
          className={
            senderShard !== undefined || receiverShard !== undefined
              ? 'text-primary'
              : ''
          }
        />
      </div>
    </OverlayTrigger>
  );
};
