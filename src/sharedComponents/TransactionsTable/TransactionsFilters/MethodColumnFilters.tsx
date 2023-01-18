import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TxActionsEnum } from 'helpers/types';
import { SelectFilter } from 'sharedComponents';

export const MethodColumnFilters = () => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const { search, function: method } = Object.fromEntries(urlParams);

  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  const searchMethods = (Object.keys(TxActionsEnum) as (keyof typeof TxActionsEnum)[]).map(
    (key) => {
      return {
        value: key,
        label: capitalize(TxActionsEnum[key]),
      };
    }
  );

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
              {searchMethods.length > 0 && (
                <div className="filter-block">
                  <div className="mb-1">Method</div>
                  <SelectFilter
                    name="function-filter"
                    options={searchMethods}
                    filter="function"
                    placeholder="Search"
                    hasCustomSearch
                  />
                </div>
              )}
              {/* <div className="filter-block">
                <div className="mb-1">Data</div>
                 <SearchFilter
                  name="search-data"
                  filter="search"
                  placeholder="Search in transaction data"
                /> 
              </div> */}
            </div>
          </Popover.Content>
        </Popover>
      }
    >
      <div className="d-inline-block side-action cursor-pointer" data-testid="StatusFilterButton">
        <FontAwesomeIcon
          icon={search !== undefined || method !== undefined ? faFilterSolid : faFilter}
          className={search !== undefined || method !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
