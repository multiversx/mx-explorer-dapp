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
}: {
  page: string;
  total: number | '...';
  itemsPerPage: number;
  show: boolean;
  className?: string;
}) => {
  const { activeNetworkId } = useGlobalState();

  const { pathname: originalPathname } = useLocation();
  const pathname = activeNetworkId
    ? originalPathname.replace(`/${activeNetworkId}`, '')
    : originalPathname;

  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams);

  const { size, start, last, lastPage, end } = pagerHelper({
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

  const startEnd = end <= 1 ? end : `${start.toLocaleString('en')}-${last.toLocaleString('en')}`;

  const lastUrlParams = new URLSearchParams({
    ...params,
    page: `${lastPage}`,
  }).toString();

  return show ? (
    <div className={className}>
      <ul className="list-inline m-0">
        <li className="list-inline-item">
          {size === 1 ? (
            <div className="pager btn btn-primary-light text-muted">
              <FontAwesomeIcon icon={faBackward} />
            </div>
          ) : (
            <NetworkLink
              className="pager btn btn-primary-light"
              data-testid="nextPageButton"
              to={`${pathname}?${firstUrlParams}`}
            >
              <FontAwesomeIcon icon={faBackward} />
            </NetworkLink>
          )}
        </li>

        <li className="list-inline-item">
          {size === 1 ? (
            <div
              className="pager btn btn-primary-light text-muted"
              data-testid="disabledPreviousPageButton"
            >
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </div>
          ) : (
            <NetworkLink
              className="pager btn btn-primary-light"
              to={prevPageUrl}
              data-testid="previousPageButton"
            >
              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
            </NetworkLink>
          )}
        </li>
        <li className="list-inline-item mx-2">
          <span>
            <span data-testid="pageInterval">{startEnd}</span>
            &nbsp;of&nbsp;
            <span data-testid="totalPages">{total.toLocaleString('en')}</span>
          </span>
        </li>
        <li className="list-inline-item ml-2">
          {total === '...' || end < total ? (
            <NetworkLink
              className="pager btn btn-primary-light"
              data-testid="nextPageButton"
              to={`${pathname}?${nextUrlParams}`}
            >
              <FontAwesomeIcon icon={faCaretRight} size="lg" />
            </NetworkLink>
          ) : (
            <div
              className="pager btn btn-primary-light text-muted"
              data-testid="disabledNextPageButton"
            >
              <FontAwesomeIcon icon={faCaretRight} size="lg" />
            </div>
          )}
        </li>

        <li className="list-inline-item">
          {!isNaN(lastPage) && end < total ? (
            <NetworkLink
              className="pager btn btn-primary-light"
              data-testid="nextPageButton"
              to={`${pathname}?${lastUrlParams}`}
            >
              <FontAwesomeIcon icon={faForward} />
            </NetworkLink>
          ) : (
            <span className="pager btn btn-primary-light text-muted">
              <FontAwesomeIcon icon={faForward} />
            </span>
          )}
        </li>
      </ul>
    </div>
  ) : null;
};

export default Pager;
