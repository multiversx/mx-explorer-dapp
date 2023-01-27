import React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

export const StatusFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { online, page, ...rest } = Object.fromEntries(searchParams);

  const onlineLink = (onlineValue: string) => {
    const nextUrlParams = {
      ...rest,
      ...(onlineValue ? { online: onlineValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <OverlayTrigger
      trigger='click'
      key='popover'
      placement='bottom'
      rootClose
      overlay={
        <Popover id='popover-positioned-bottom' className='border'>
          <Popover.Body>
            <div
              className={`dropdown-item ${online === 'true' ? 'active' : ''}`}
              onClick={() => {
                onlineLink('true');
              }}
              data-testid='filterByStatusOnline'
            >
              Online
            </div>
            <div
              className={`dropdown-item ${online === 'false' ? 'active' : ''}`}
              onClick={() => {
                onlineLink('false');
              }}
              data-testid='filterByStatusOffline'
            >
              Offline
            </div>
            <div
              className={`dropdown-item ${online === undefined ? '' : ''}`}
              onClick={() => {
                onlineLink('');
              }}
              data-testid='filterByStatusAll'
            >
              Show all
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='shardFilterButton'
      >
        <FontAwesomeIcon
          icon={online !== undefined ? faFilterSolid : faFilter}
          className={online !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
