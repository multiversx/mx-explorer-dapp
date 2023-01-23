import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useNetworkPathname } from 'helpers';
import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ShardSpan, NetworkLink, useAdapter } from 'components';

import { useSelector, useDispatch } from 'react-redux';
import { shardsSelector } from 'redux/selectors';
import { setShards } from 'redux/slices/interface';

export const ShardFilter = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(search);
  const { shard, page, ...rest } = Object.fromEntries(urlParams);
  const { getShards } = useAdapter();
  const shards = useSelector(shardsSelector);
  const networkPathname = useNetworkPathname();

  const fetchShards = () => {
    if (shards.length === 0) {
      getShards().then((shards) => {
        if (shards.success && shards?.data) {
          dispatch(setShards(shards.data));
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchShards, []);

  const shardLink = (shard: string) => {
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(shard ? { shard } : {}),
    }).toString();
    return `${networkPathname}?${nextUrlParams}`;
  };

  return (
    <OverlayTrigger
      trigger="click"
      key="popover"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom" className="border">
          {shards.length > 0 && (
            <Popover.Content>
              {shards.map((entry, i) => {
                return (
                  <NetworkLink
                    to={shardLink(entry.shard.toString())}
                    className={`dropdown-item ${shard === entry.shard.toString() ? 'active' : ''}`}
                    key={entry.shard + i}
                  >
                    <ShardSpan shard={entry.shard} />
                  </NetworkLink>
                );
              })}
              <NetworkLink
                className={`dropdown-item ${shard === undefined ? 'active' : ''}`}
                key={-1}
                to={shardLink('')}
              >
                Show all
              </NetworkLink>
            </Popover.Content>
          )}
        </Popover>
      }
    >
      <a
        className="d-inline-block side-action"
        data-testid="shardFilterButton"
        href={`${networkPathname}/${search}`}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <FontAwesomeIcon
          icon={shard !== undefined ? faFilterSolid : faFilter}
          className={shard !== undefined ? 'text-primary' : ''}
        />
      </a>
    </OverlayTrigger>
  );
};
