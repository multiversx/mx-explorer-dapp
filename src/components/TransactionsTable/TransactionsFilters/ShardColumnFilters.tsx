import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';

import { TxFiltersEnum, TransactionsTableType } from 'helpers/types';
import { useAdapter, SelectFilter } from 'components';
import { shardSpanText } from 'components/ShardSpan';

export const ShardColumnFilters = ({
  inactiveFilters = [],
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const dispatch = useGlobalDispatch();
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const { senderShard, receiverShard } = Object.fromEntries(urlParams);
  const { getShards } = useAdapter();
  const { shards: stateShards } = useGlobalState();

  const fetchShards = () => {
    if (stateShards.length === 0) {
      getShards().then((shards) => {
        if (shards.success) {
          dispatch({
            type: 'setShards',
            shards: shards.data,
          });
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchShards, []);

  const searchShards = stateShards.map((shard) => {
    return { value: shard.shard.toString(), label: shardSpanText(shard.shard.toString()) };
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
      trigger="click"
      key="popover"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom" className="border popover-xs bg-light">
          {stateShards.length > 0 && (
            <Popover.Content>
              <div className="p-3 text-dark">
                {!inactiveFilters.includes(TxFiltersEnum.senderShard) && (
                  <div className="filter-block">
                    <div className="mb-1">Sender Shard</div>
                    <SelectFilter
                      name="senderShard-filter"
                      options={searchShards}
                      filter={TxFiltersEnum.senderShard}
                    />
                  </div>
                )}

                {!inactiveFilters.includes(TxFiltersEnum.receiverShard) && (
                  <div className="filter-block">
                    <div className="mb-1">Receiver Shard</div>
                    <SelectFilter
                      name="receiverShard-filter"
                      options={searchShards}
                      filter={TxFiltersEnum.receiverShard}
                    />
                  </div>
                )}
              </div>
            </Popover.Content>
          )}
        </Popover>
      }
    >
      <div className="d-inline-block side-action cursor-pointer" data-testid="shardFilterButton">
        <FontAwesomeIcon
          icon={senderShard !== undefined || receiverShard !== undefined ? faFilterSolid : faFilter}
          className={senderShard !== undefined || receiverShard !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
