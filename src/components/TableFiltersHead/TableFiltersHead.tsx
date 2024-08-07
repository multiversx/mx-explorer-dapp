import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { capitalize, getNodeStatusDisplay } from 'helpers';
import { useGetShardText } from 'hooks';
import { faClose } from 'icons/regular';
import { NodeApiStatusEnum } from 'types';

export interface TableFiltersHeadType {
  filters?: { [k: string]: string | number | boolean | undefined };
  hideFilters?: boolean;
  ignoredFilters?: string[];
  colSpan?: number;
}

export const TableFiltersHead = ({
  filters,
  hideFilters,
  ignoredFilters = [],
  colSpan = 12
}: TableFiltersHeadType) => {
  const getShardText = useGetShardText();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!filters || hideFilters) {
    return null;
  }

  const filtersKeysArray = Object.keys(filters).filter(
    (key) => !ignoredFilters.includes(key)
  );

  if (filtersKeysArray.length === 0) {
    return null;
  }

  const clearFilter = (key: string) => {
    const { page, size, search, ...rest } = Object.fromEntries(searchParams);

    if (key) {
      delete rest[key];
    }

    const nextUrlParams = {
      ...rest
    };

    setSearchParams(nextUrlParams);
  };

  const getDisplayKey = (key: string) => {
    switch (key) {
      case 'isQualified':
        return 'Qualified';
      case 'isAuctionDangerZone':
        return 'Danger Zone';
      default:
        return capitalize(String(key));
    }
  };

  const getDisplayValue = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    switch (key) {
      case 'shard':
        return getShardText(String(value));
      case 'status':
        const { text, textColor, icon, iconColor } = getNodeStatusDisplay({
          status: String(value) as NodeApiStatusEnum
        });
        return (
          <div className='d-flex align-items-center gap-1'>
            {icon && <FontAwesomeIcon icon={icon} className={iconColor} />}
            <span className={textColor}>{text}</span>
          </div>
        );
      default:
        return String(value);
    }
  };

  return (
    <tr className='table-filters-head'>
      <th colSpan={colSpan} scope='colgroup' data-testid='table-filters'>
        <div className='d-flex flex-row flex-wrap align-items-center gap-2 text-neutral-500'>
          <span>Active Filters:</span>
          {filtersKeysArray.map((key) => {
            return (
              <div
                key={key}
                className='badge badge-sm bg-black text-capitalize'
              >
                <span>{getDisplayKey(key)}:</span>
                <span className='filter-value text-neutral-200'>
                  {getDisplayValue(key, filters[key as keyof typeof filters])}
                </span>
                <button
                  type='button'
                  onClick={() => {
                    clearFilter(key);
                  }}
                  className='btn btn-link-unstyled'
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
            );
          })}
        </div>
      </th>
    </tr>
  );
};
