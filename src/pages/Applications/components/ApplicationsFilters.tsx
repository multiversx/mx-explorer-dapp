import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
import { formatBigNumber } from 'helpers';
import { WithClassnameType } from 'types';

export interface ApplicationsFiltersUIType extends WithClassnameType {
  applicationsCount?: number | typeof ELLIPSIS;
  verifiedApplicationsCount?: number | typeof ELLIPSIS;
}

export const ApplicationsFilters = ({
  applicationsCount,
  verifiedApplicationsCount
}: ApplicationsFiltersUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { isVerified, ...rest } = Object.fromEntries(searchParams);

  const verifiedApplicationLink = (verified: boolean) => {
    const nextUrlParams: { [k: string]: string } = {
      ...rest,
      ...(verified ? { isVerified: String(verified) } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
      <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
        <li className='list-inline-item me-0'>
          <button
            type='button'
            onClick={() => {
              verifiedApplicationLink(false);
            }}
            data-testid='filterByObservers'
            className={classNames(
              'btn btn-tab d-flex align-items-center gap-1',
              { active: !isVerified }
            )}
          >
            All
            {applicationsCount !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: applicationsCount })}
              </span>
            )}
          </button>
        </li>
        <li className='list-inline-item me-0'>
          <button
            type='button'
            onClick={() => {
              verifiedApplicationLink(true);
            }}
            data-testid='filterByObservers'
            className={classNames(
              'btn btn-tab d-flex align-items-center gap-1',
              { active: isVerified }
            )}
          >
            Verified
            {verifiedApplicationsCount !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: verifiedApplicationsCount })}
              </span>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};
