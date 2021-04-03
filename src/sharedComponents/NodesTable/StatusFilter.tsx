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
  const { online, page, ...rest } = Object.fromEntries(urlParams);

  const networkPathname = useNetworkPathname();

  const onlineLink = (onlineValue: string) => {
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(onlineValue ? { online: onlineValue } : {}),
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
              className={`dropdown-item ${online === 'true' ? 'active' : ''}`}
              to={onlineLink('true')}
              data-testid="filterByStatusOnline"
            >
              Online
            </NetworkLink>
            <NetworkLink
              className={`dropdown-item ${online === 'false' ? 'active' : ''}`}
              to={onlineLink('false')}
              data-testid="filterByStatusOffline"
            >
              Offline
            </NetworkLink>
            <NetworkLink
              className={`dropdown-item ${online === undefined ? '' : ''}`}
              to={onlineLink('')}
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
          icon={online !== undefined ? faFilterSolid : faFilter}
          className={online !== undefined ? 'text-primary' : ''}
        />
      </a>
    </OverlayTrigger>
  );
};

export default StatusFilter;
