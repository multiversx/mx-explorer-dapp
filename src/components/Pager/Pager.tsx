import React from 'react';
import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons/faAngleRight';
import { faAnglesLeft } from '@fortawesome/pro-solid-svg-icons/faAnglesLeft';
import { faAnglesRight } from '@fortawesome/pro-solid-svg-icons/faAnglesRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router-dom';
import { pagerHelper } from './pagerHelper';

export const Pager = ({
  total,
  show,
  page,
  itemsPerPage,
  className = '',
  hasTestId = true
}: {
  page: string;
  total: number | '...';
  itemsPerPage: number;
  show: boolean;
  className?: string;
  hasTestId?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  const { size, lastPage, end, paginationArray } = pagerHelper({
    total,
    itemsPerPage,
    page
  });

  const nextUrlParams = {
    ...params,
    page: `${size + 1}`
  };

  const { page: urlPage, ...rest } = params;

  const firstUrlParams = {
    ...rest
  };
  const prevUrlParams = {
    ...params,
    page: `${size - 1}`
  };

  const lastUrlParams = {
    ...params,
    page: `${lastPage}`
  };

  const updatePage = (nextUrlParams: any) => {
    setSearchParams(nextUrlParams);
  };

  const leftBtnActive = size !== 1;
  const rightBtnsActive = end < total;

  return show ? (
    <div className={`pager ${className}`}>
      <div className='m-0 d-flex align-items-strech'>
        <div
          className={`btns-contrainer left ${leftBtnActive ? '' : 'inactive'}`}
        >
          {size === 1 ? (
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

          {size === 1 ? (
            <div
              className='btn btn-pager'
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
              className='btn btn-pager'
              onClick={() =>
                updatePage(size === 2 ? firstUrlParams : prevUrlParams)
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
                {page !== '...' ? (
                  <button
                    type='button'
                    className={`btn btn-pager ${page === size ? 'active' : ''}`}
                    onClick={() => updatePage(currentUrlParams)}
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
          {total === '...' || end < total ? (
            <button
              type='button'
              className='btn btn-pager'
              onClick={() => updatePage(nextUrlParams)}
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </button>
          ) : (
            <div
              className='btn btn-pager'
              {...(hasTestId
                ? { 'data-testid': 'disabledNextPageButton' }
                : {})}
            >
              <span className='d-none d-sm-flex pe-2'>Next</span>
              <FontAwesomeIcon icon={faAngleRight} size='lg' />
            </div>
          )}

          {!isNaN(lastPage) && end < total ? (
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
