import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE, MAX_RESULTS } from 'appConstants';
import { stringIsInteger, formatOrdinals } from 'helpers';
import { useGetCursorHistory } from 'hooks';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from 'icons/solid';
import { generatePaginationArray, pagerHelper } from './helpers/pagerHelper';

export interface PagerUIType {
  total?: number | typeof ELLIPSIS;
  show?: boolean;
  itemsPerPage?: number;
  showFirstAndLast?: boolean;
  className?: string;
  hasTestId?: boolean;
  items?: { searchAfter?: string }[];
}

export const Pager = ({
  total = ELLIPSIS,
  show,
  itemsPerPage = PAGE_SIZE,
  showFirstAndLast,
  className = '',
  hasTestId = true,
  items = []
}: PagerUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { getCursor, setCursor } = useGetCursorHistory();

  const nextCursor = items[items.length - 1]?.searchAfter;
  const itemsCount = items.length;

  const { page, size, searchAfter, ...rest } = params;
  const processedSize = stringIsInteger(String(size))
    ? parseInt(String(size))
    : itemsPerPage;

  const processedTotal = total !== ELLIPSIS ? Math.min(total, MAX_RESULTS) : 0;

  const {
    processedPage,
    lastPage,
    end,
    lastOffsetPage,
    isCursorMode,
    paginationArray
  } = pagerHelper({
    total: processedTotal,
    itemsPerPage: processedSize,
    page: Number(page)
  });

  const hasResultsPastCeiling = total === ELLIPSIS || total > MAX_RESULTS;
  const isCursorNext =
    processedPage >= lastOffsetPage &&
    Boolean(nextCursor) &&
    hasResultsPastCeiling;
  const isLastCursorPage = isCursorMode && itemsCount < processedSize;

  const baseUrlParams = { ...rest, ...(size ? { size } : {}) };
  const previousCursor = getCursor(processedPage - 1);
  const previousPage = processedPage - 1;

  const nextUrlParams = {
    ...baseUrlParams,
    page: `${processedPage + 1}`,
    ...(isCursorNext && nextCursor ? { searchAfter: nextCursor } : {})
  };

  const firstUrlParams = {
    ...rest
  };
  const prevUrlParams = {
    ...baseUrlParams,
    page: `${previousPage}`,
    ...(previousPage > lastOffsetPage && previousCursor
      ? { searchAfter: previousCursor }
      : {})
  };

  const lastUrlParams = {
    ...baseUrlParams,
    page: `${lastPage}`
  };

  const pages = isCursorMode
    ? generatePaginationArray({
        currentPage: processedPage,
        totalPages: processedPage + (nextCursor ? 1 : 0)
      })
    : paginationArray;

  const getPageUrlParams = (page: number) => {
    if (page <= lastOffsetPage) {
      return { ...baseUrlParams, page: `${page}` };
    }
    if (page === processedPage + 1 && nextCursor) {
      return { ...baseUrlParams, page: `${page}`, searchAfter: nextCursor };
    }
    const cursor = getCursor(page);

    return cursor
      ? { ...baseUrlParams, page: `${page}`, searchAfter: cursor }
      : undefined;
  };

  const updatePage = (urlParams: Record<string, string>) => {
    setSearchParams(urlParams);
  };

  useEffect(() => {
    if (isCursorMode && searchAfter) {
      setCursor(processedPage, searchAfter);
    }
  }, [isCursorMode, searchAfter, processedPage]);

  useEffect(() => {
    if (isCursorMode && itemsCount && !nextCursor) {
      setSearchParams(
        { ...rest, page: `${lastOffsetPage}` },
        { replace: true }
      );
    }
  }, [isCursorMode, nextCursor, itemsCount, lastOffsetPage]);

  const canGoPrevious = isCursorMode
    ? previousPage <= lastOffsetPage || Boolean(previousCursor)
    : processedPage !== 1;
  const canGoNext = isCursorMode
    ? Boolean(nextCursor) && !isLastCursorPage
    : total === ELLIPSIS || end < processedTotal || isCursorNext;

  const leftBtnActive = canGoPrevious;
  const rightBtnsActive = canGoNext;

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

          {!canGoPrevious ? (
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
          {pages.map((page, index) => {
            if (page === ELLIPSIS) {
              return <span key={`ellipsis-${index}`}>{ELLIPSIS}</span>;
            }

            const pageNumber = Number(page);
            const isActive = pageNumber === processedPage;
            const pageUrlParams = getPageUrlParams(pageNumber);

            return (
              <button
                key={`${page}-${index}`}
                type='button'
                className={`btn btn-pager page-btn ${isActive ? 'active' : ''}`}
                aria-label={`${formatOrdinals(pageNumber)} Page`}
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
                disabled={!isActive && !pageUrlParams}
                onClick={() => {
                  if (!isActive && pageUrlParams) {
                    updatePage(pageUrlParams);
                  }
                }}
              >
                {page}
              </button>
            );
          })}
        </div>

        <div
          className={`btns-contrainer right ${
            rightBtnsActive ? '' : 'inactive'
          }`}
        >
          {canGoNext ? (
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
              {!isCursorMode && !isNaN(lastPage) && end < processedTotal ? (
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
