import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TxFiltersEnum, TransactionsTableType } from 'types';
import { SelectFilter, SelectFilterType } from 'components';
import { truncateMiddle } from 'helpers';

export const ToColumnFilters = ({
  inactiveFilters = [],
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);

  const { receiver } = Object.fromEntries(urlParams);

  const existingValues: SelectFilterType['options'] =
    receiver?.split(',').map((receiver) => {
      return { value: receiver, label: truncateMiddle(receiver, 9) };
    }) ?? [];

  if (inactiveFilters && inactiveFilters.includes(TxFiltersEnum.receiver)) {
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
          <Popover.Content>
            <div className="p-3 text-dark">
              <div className="filter-block">
                <div className="mb-1">To</div>
                <SelectFilter
                  name="receiver-filter"
                  options={existingValues}
                  filter={TxFiltersEnum.receiver}
                  placeholder="Search for multiple addresses"
                  validation="address"
                  noOptionsMessage="Invalid Address"
                  hasCustomSearch
                  isMulti
                />
              </div>
            </div>
          </Popover.Content>
        </Popover>
      }
    >
      <div className="d-inline-block side-action cursor-pointer" data-testid="StatusFilterButton">
        <FontAwesomeIcon
          icon={receiver !== undefined ? faFilterSolid : faFilter}
          className={receiver !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
