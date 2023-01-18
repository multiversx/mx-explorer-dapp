import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';

import { adapter, SelectFilter } from 'sharedComponents';
import { shardSpanText } from 'sharedComponents/ShardSpan';

export const ShardColumnFilters = () => {
  const dispatch = useGlobalDispatch();
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const { senderShard, receiverShard } = Object.fromEntries(urlParams);
  const { getShards } = adapter();
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
                <div className="filter-block">
                  <div className="mb-1">Sender Shard</div>
                  <SelectFilter
                    name="senderShard-filter"
                    options={searchShards}
                    filter="senderShard"
                  />
                </div>
                <div className="filter-block">
                  <div className="mb-1">Receiver Shard</div>
                  <SelectFilter
                    name="receiverShard-filter"
                    options={searchShards}
                    filter="receiverShard"
                  />
                </div>
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
