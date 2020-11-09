import * as React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';

const StatusLabel = () => {
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { status, ...rest } = Object.fromEntries(urlParams);

  const statusLink = (status: string) => {
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(status ? { status } : {}),
    }).toString();
    return `${pathname}?${nextUrlParams}`;
  };

  return (
    <>
      Status
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
          className="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block side-action"
          data-testid="shardFilterButton"
          href={`${pathname}/${search}`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <FontAwesomeIcon icon={faFilter} className={status !== undefined ? 'text-primary' : ''} />
        </a>
      </OverlayTrigger>
    </>
  );
};

export default StatusLabel;
