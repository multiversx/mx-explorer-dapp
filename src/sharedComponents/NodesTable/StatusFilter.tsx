import * as React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { useNetworkPathname } from 'helpers';

const StatusFilter = () => {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { status, page, ...rest } = Object.fromEntries(urlParams);

  const networkPathname = useNetworkPathname();

  const statusLink = (status: string) => {
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(status ? { status } : {}),
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
          <Popover.Content>
            <NetworkLink
              className={`dropdown-item ${status === 'online' ? 'active' : ''}`}
              to={statusLink('online')}
              data-testid="filterByStatusOnline"
            >
              Online
            </NetworkLink>
            <NetworkLink
              className={`dropdown-item ${status === 'offline' ? 'active' : ''}`}
              to={statusLink('offline')}
              data-testid="filterByStatusOffline"
            >
              Offiline
            </NetworkLink>
            <NetworkLink
              className={`dropdown-item ${status === undefined ? 'active' : ''}`}
              to={statusLink('')}
              data-testid="filterByStatusAll"
            >
              Show all
            </NetworkLink>
          </Popover.Content>
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
          icon={status !== undefined ? faFilterSolid : faFilter}
          className={status !== undefined ? 'text-primary' : ''}
        />
      </a>
    </OverlayTrigger>
  );
};

export default StatusFilter;
