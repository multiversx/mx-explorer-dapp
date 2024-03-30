import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE, MAX_RESULTS } from 'appConstants';
import { stringIsInteger, formatOrdinals } from 'helpers';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from 'icons/solid';
import { pagerHelper } from './helpers/pagerHelper';

export interface PagerUIType {
  total?: number | typeof ELLIPSIS;
  show?: boolean;
  itemsPerPage?: number;
  showFirstAndLast?: boolean;
  className?: string;
  hasTestId?: boolean;
}

export const Pager = ({
  total = ELLIPSIS,
  show = false,
  itemsPerPage = PAGE_SIZE,
  showFirstAndLast = true,
  className = '',
  hasTestId = true
}: PagerUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  const { page, size, ...rest } = params;
  const processedSize = stringIsInteger(String(size))
    ? parseInt(String(size))
    : itemsPerPage;

  const processedTotal = total !== ELLIPSIS ? Math.min(total, MAX_RESULTS) : 0;

  const { processedPage, lastPage, end, paginationArray } = pagerHelper({
    total: processedTotal,
    itemsPerPage: processedSize,
    page: Number(page)
  });

  const nextUrlParams = {
    ...params,
    page: `${processedPage + 1}`
  };

  const firstUrlParams = {
    ...rest
  };
  const prevUrlParams = {
    ...params,
    page: `${processedPage - 1}`
  };
  const lastUrlParams = {
    ...params,
    page: `${lastPage}`
  };

  const updatePage = (nextUrlParams: any) => {
    setSearchParams(nextUrlParams);
  };

  const leftBtnActive = processedPage !== 1;
  const rightBtnsActive = end < processedTotal;

  return show ? (
    <div className={`pager ${className}`}>
      <div className='m-0 d-flex align-items-strech'>
        <div
          className={`btns-contrainer left ${leftBtnActive ? '' : 'inactive'}`}
        >
          {showFirstAndLast && (
            <>
              {processedPage === 1 ? (
                <div className='btn btn-pager'>
                  <FontAwesomeIcon
                    icon={faAnglesLeft}
                    size='lg'
                    aria-label='No First Page'
                  />
                </div>
              ) : (
                <button
                  type='button'
                  className='btn btn-pager'
                  onClick={() => updatePage(firstUrlParams)}
                  aria-label='First Page'
                  {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
                >
                  <FontAwesomeIcon icon={faAnglesLeft} size='lg' />
                </button>
              )}
            </>
          )}

          {processedPage === 1 ? (
            <div
              className='btn btn-pager previous-btn'
              aria-label='No Previous Page'
              {...(hasTestId
                ? { 'data-testid': 'disabledPreviousPageButton' }
                : {})}
            >
              <FontAwesomeIcon icon={faAngleLeft} size='lg' />
              <span className='d-none d-sm-flex ps-2'>Prev</span>
            </div>
          ) : (
            <button
              type='button'
              className='btn btn-pager previous-btn'
              aria-label='Previous Page'
              onClick={() =>
                updatePage(processedPage === 2 ? firstUrlParams : prevUrlParams)
              }
              {...(hasTestId ? { 'data-testid': 'previousPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faAngleLeft} size='lg' />
              <span className='d-none d-sm-flex ps-2'>Prev</span>
            </button>
          )}
        </div>

        <div className='d-flex align-items-center page-holder'>
          {paginationArray.map((page, index) => {
            const currentUrlParams = {
              ...params,
              page: String(page)
            };

            return (
              <Fragment key={`${page}-${index}`}>
                {page !== ELLIPSIS ? (
                  <button
                    type='button'
                    className={`btn btn-pager page-btn ${
                      page === processedPage ? 'active' : ''
                    }`}
                    aria-label={`${formatOrdinals(Number(page))} Page`}
                    onClick={() => {
                      if (page !== processedPage) {
                        updatePage(currentUrlParams);
                      }
                    }}
                  >
                    {page}
                  </button>
                ) : (
                  <span>...</span>
                )}
              </Fragment>
            );
          })}
        </div>

        <div
          className={`btns-contrainer right ${
            rightBtnsActive ? '' : 'inactive'
          }`}
        >
          {total === ELLIPSIS || end < processedTotal ? (
            <button
              type='button'
              className='btn btn-pager next-btn'
              onClick={() => updatePage(nextUrlParams)}
              aria-label='Next Page'
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </button>
          ) : (
            <div
              className='btn btn-pager next-btn'
              aria-label='No Next Page'
              {...(hasTestId
                ? { 'data-testid': 'disabledNextPageButton' }
                : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </div>
          )}

          {showFirstAndLast && (
            <>
              {!isNaN(lastPage) && end < processedTotal ? (
                <button
                  type='button'
                  className='btn btn-pager'
                  onClick={() => updatePage(lastUrlParams)}
                  aria-label='Last Page'
                  {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
                >
                  <FontAwesomeIcon icon={faAnglesRight} size='lg' />
                </button>
              ) : (
                <span className='btn btn-pager'>
                  <FontAwesomeIcon
                    icon={faAnglesRight}
                    size='lg'
                    aria-label='No Last Page'
                  />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
