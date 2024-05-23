import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter } from 'components';
import { getShardText } from 'helpers';
import { useFetchShards, useIsSovereign } from 'hooks';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { shardsSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const ShardColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const stateShards = useSelector(shardsSelector);
  const [searchParams] = useSearchParams();
  const isSovereign = useIsSovereign();
  const { senderShard, receiverShard } = Object.fromEntries(searchParams);

  useFetchShards();

  const selectShards = stateShards.map((shard) => {
    return {
      value: shard.shard.toString(),
      label: getShardText(shard.shard.toString(), isSovereign)
    };
  });

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.senderShard) &&
    inactiveFilters.includes(TransactionFiltersEnum.receiverShard)
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
                {!inactiveFilters.includes(
                  TransactionFiltersEnum.senderShard
                ) && (
                  <div className='filter-block'>
                    <div className='mb-1'>
                      Sender {isSovereign ? 'Chain' : 'Shard'}
                    </div>
                    <SelectFilter
                      name='senderShard-filter'
                      options={selectShards}
                      filter={TransactionFiltersEnum.senderShard}
                    />
                  </div>
                )}

                {!inactiveFilters.includes(
                  TransactionFiltersEnum.receiverShard
                ) && (
                  <div className='filter-block'>
                    <div className='mb-1'>Receiver Shard</div>
                    <SelectFilter
                      name='receiverShard-filter'
                      options={selectShards}
                      filter={TransactionFiltersEnum.receiverShard}
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
