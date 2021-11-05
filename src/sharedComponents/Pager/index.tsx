import { faCaretLeft } from '@fortawesome/pro-solid-svg-icons/faCaretLeft';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { faForward } from '@fortawesome/pro-solid-svg-icons/faForward';
import { faBackward } from '@fortawesome/pro-solid-svg-icons/faBackward';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import pagerHelper from './pagerHelper';
import { useGlobalState } from 'context';

const Pager = ({
  total,
  show,
  page,
  itemsPerPage,
  className = '',
  hasTestId = true,
}: {
  page: string;
  total: number | '...';
  itemsPerPage: number;
  show: boolean;
  className?: string;
  hasTestId?: boolean;
}) => {
  const { activeNetworkId } = useGlobalState();

  const { pathname: originalPathname } = useLocation();
  const pathname = activeNetworkId
    ? originalPathname.replace(`/${activeNetworkId}`, '')
    : originalPathname;

  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams);

  const { size, lastPage, end } = pagerHelper({
    total,
    itemsPerPage,
    page,
  });

  const nextUrlParams = new URLSearchParams({
    ...params,
    page: `${size + 1}`,
  }).toString();

  const { page: urlPage, ...rest } = params;

  const firstUrlParams = new URLSearchParams({
    ...rest,
  }).toString();
  const prevUrlParams = new URLSearchParams({
    ...params,
    page: `${size - 1}`,
  }).toString();

  const prevPageUrl = size === 2 ? `${pathname}?${firstUrlParams}` : `${pathname}?${prevUrlParams}`;

  const startEnd = size;

  const lastUrlParams = new URLSearchParams({
    ...params,
    page: `${lastPage}`,
  }).toString();

  const leftBtnActive = size !== 1;
  const rightBtnsActive = end < total;

  return show ? (
    <div className={`pager ${className}`}>
      <div className="m-0 d-flex align-items-strech">
        <div className={`btns-contrainer left border ${leftBtnActive ? '' : 'inactive'}`}>
          {size === 1 ? (
            <div className="btn btn-primary-light">
              <FontAwesomeIcon icon={faBackward} />
            </div>
          ) : (
            <NetworkLink
              className="btn btn-primary-light"
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
              to={`${pathname}?${firstUrlParams}`}
            >
              <FontAwesomeIcon icon={faBackward} />
            </NetworkLink>
          )}

          {size === 1 ? (
            <div
              className="btn btn-primary-light"
              {...(hasTestId ? { 'data-testid': 'disabledPreviousPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </div>
          ) : (
            <NetworkLink
              className="btn btn-primary-light"
              to={prevPageUrl}
              {...(hasTestId ? { 'data-testid': 'previousPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </NetworkLink>
          )}
        </div>

        <div className="d-flex align-items-center current-page border px-2">
          <span>
            <span {...(hasTestId ? { 'data-testid': 'pageInterval' } : {})}>{startEnd}</span>
            &nbsp;/&nbsp;
            <span {...(hasTestId ? { 'data-testid': 'totalPages' } : {})}>
              {!isNaN(lastPage) ? lastPage.toLocaleString('en') : 1}
            </span>
          </span>
        </div>

        <div className={`btns-contrainer right border ${rightBtnsActive ? '' : 'inactive'}`}>
          {total === '...' || end < total ? (
            <NetworkLink
              className="btn btn-primary-light"
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
              to={`${pathname}?${nextUrlParams}`}
            >
              <FontAwesomeIcon icon={faCaretRight} size="lg" />
            </NetworkLink>
          ) : (
            <div
              className="btn btn-primary-light"
              {...(hasTestId ? { 'data-testid': 'disabledNextPageButton' } : {})}
            >
              <FontAwesomeIcon icon={faCaretRight} size="lg" />
            </div>
          )}

          {!isNaN(lastPage) && end < total ? (
            <NetworkLink
              className="btn btn-primary-light"
              {...(hasTestId ? { 'data-testid': 'nextPageButton' } : {})}
              to={`${pathname}?${lastUrlParams}`}
            >
              <FontAwesomeIcon icon={faForward} />
            </NetworkLink>
          ) : (
            <span className="btn btn-primary-light">
              <FontAwesomeIcon icon={faForward} />
            </span>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Pager;
