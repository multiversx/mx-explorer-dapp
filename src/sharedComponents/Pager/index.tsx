import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { faAngleDoubleRight } from '@fortawesome/pro-regular-svg-icons/faAngleDoubleRight';
import { faAngleDoubleLeft } from '@fortawesome/pro-regular-svg-icons/faAngleDoubleLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import pagerHelper from './pagerHelper';

const Pager = ({
  total,
  show,
  page,
  itemsPerPage,
}: {
  page: string;
  total: number | '...';
  itemsPerPage: number;
  show: boolean;
}) => {
  const { pathname } = useLocation();
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

  const firstUrlParams = new URLSearchParams({
    ...params,
    page: '1',
  }).toString();
  const prevUrlParams = new URLSearchParams({
    ...params,
    page: `${size - 1}`,
  }).toString();

  const prevPageUrl = size === 2 ? `${pathname}?${firstUrlParams}` : `${pathname}?${prevUrlParams}`;

  const startEnd = end === 1 ? 1 : `${start.toLocaleString('en')}-${last.toLocaleString('en')}`;

  const lastUrlParams = new URLSearchParams({
    ...params,
    page: `${lastPage}`,
  }).toString();

  return show ? (
    <div className="float-right mt-3">
      <ul className="list-inline">
        <li className="list-inline-item">
          <div className="pager">
            {size === 1 ? (
              <span className="text-muted">
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </span>
            ) : (
              <NetworkLink data-testid="nextPageButton" to={`${pathname}?${firstUrlParams}`}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </NetworkLink>
            )}
          </div>
        </li>
        <li className="list-inline-item">
          {size === 1 ? (
            <div className="pager">
              <span className="text-muted" data-testid="disabledPreviousPageButton">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </span>
            </div>
          ) : (
            <div className="pager">
              <NetworkLink to={prevPageUrl} data-testid="previousPageButton">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </NetworkLink>
            </div>
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
            <div className="pager">
              <NetworkLink data-testid="nextPageButton" to={`${pathname}?${nextUrlParams}`}>
                Next <FontAwesomeIcon icon={faAngleRight} />
              </NetworkLink>
            </div>
          ) : (
            <div className="pager">
              <span className="text-muted" data-testid="disabledNextPageButton">
                Next <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </div>
          )}
        </li>

        <li className="list-inline-item">
          <div className="pager">
            {!isNaN(lastPage) && end < total ? (
              <NetworkLink data-testid="nextPageButton" to={`${pathname}?${lastUrlParams}`}>
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </NetworkLink>
            ) : (
              <span className="text-muted">
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </span>
            )}
          </div>
        </li>
      </ul>
    </div>
  ) : null;
};

export default Pager;
