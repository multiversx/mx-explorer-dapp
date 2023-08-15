import React from 'react';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE, MAX_RESULTS } from 'appConstants';
import { stringIsInteger } from 'helpers';
import { pagerHelper } from './helpers/pagerHelper';

export const Pager = ({
  total,
  show = false,
  itemsPerPage = PAGE_SIZE,
  className = '',
  hasTestId = true
}: {
  total: number | typeof ELLIPSIS;
  show?: boolean;
  itemsPerPage?: number;
  className?: string;
  hasTestId?: boolean;
}) => {
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
          {processedPage === 1 ? (
            <div className='btn btn-pager'>
              <FontAwesomeIcon icon={faAnglesLeft} size='lg' />
            </div>
          ) : (
            <button
              type='button'
              className='btn btn-pager'
              onClick={() => updatePage(firstUrlParams)}
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faAnglesLeft} size='lg' />
            </button>
          )}

          {processedPage === 1 ? (
            <div
              className='btn btn-pager previous-btn'
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
              <React.Fragment key={`${page}-${index}`}>
                {page !== ELLIPSIS ? (
                  <button
                    type='button'
                    className={`btn btn-pager page-btn ${
                      page === processedPage ? 'active' : ''
                    }`}
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
              </React.Fragment>
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
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </button>
          ) : (
            <div
              className='btn btn-pager next-btn'
              {...(hasTestId
                ? { 'data-testid': 'disabledNextPageButton' }
                : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </div>
          )}

          {!isNaN(lastPage) && end < processedTotal ? (
            <button
              type='button'
              className='btn btn-pager'
              onClick={() => updatePage(lastUrlParams)}
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faAnglesRight} size='lg' />
            </button>
          ) : (
            <span className='btn btn-pager'>
              <FontAwesomeIcon icon={faAnglesRight} size='lg' />
            </span>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
