import * as React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FiltersType } from './../helpers/useFilters';

interface StatusLabelType {
  setStatus: React.Dispatch<React.SetStateAction<FiltersType['status']>>;
  status: FiltersType['status'];
}

const StatusLabel = ({ status, setStatus }: StatusLabelType) => {
  const changeStatus = (newStatus: FiltersType['status']) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setStatus(newStatus);
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
          <Popover id="popover-positioned-bottom">
            <Popover.Content>
              <a
                className={`dropdown-item ${status === 'online' ? 'active' : ''}`}
                href="/nodes"
                onClick={changeStatus('online')}
                data-testid="filterByStatusOnline"
              >
                Online
              </a>
              <a
                className={`dropdown-item ${status === 'offline' ? 'active' : ''}`}
                href="/nodes"
                onClick={changeStatus('offline')}
                data-testid="filterByStatusOffline"
              >
                Offiline
              </a>
              <a
                className={`dropdown-item ${status === '' ? 'active' : ''}`}
                href="/nodes"
                onClick={changeStatus('')}
                data-testid="filterByStatusAll"
              >
                Show all
              </a>
            </Popover.Content>
          </Popover>
        }
      >
        <span
          className="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block"
          data-testid="shardFilterButton"
        >
          <FontAwesomeIcon icon={faFilter} className={status !== '' ? 'text-primary' : ''} />
        </span>
      </OverlayTrigger>
    </>
  );
};

export default StatusLabel;
