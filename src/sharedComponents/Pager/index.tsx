import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TestnetLink from './../TestnetLink';

const Pager = ({
  slug,
  total,
  start,
  end,
  show,
}: {
  slug: string;
  total: number | string;
  start: number;
  end: number;
  show: boolean;
}) => {
  const { page } = useParams();
  const { pathname } = useLocation();

  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? `/${slug}` : `/${slug}/page/${size - 1}`;

  const startEnd = end === 1 ? 1 : `${start.toLocaleString('en')}-${end.toLocaleString('en')}`;

  const correction = size > 2 ? 0 : 1;
  const lastPage = `${Math.ceil(parseInt(total.toString()) / (end - start + correction))}`;

  const blocksPager = pathname.includes('/blocks');

  const isLastBlocksPage = page === 'last';

  const firstCondition = blocksPager ? size === 1 && !isLastBlocksPage : size === 1;
  const prevCondition = blocksPager ? size === 1 || isLastBlocksPage : size === 1;
  const nextCondition = blocksPager ? end < total && !isLastBlocksPage : end < total;

  const PagerComponent = (
    <div className="float-right mt-3">
      <ul className="list-inline">
        <li className="list-inline-item">
          <div className="pager">
            {firstCondition ? (
              <span>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </span>
            ) : (
              <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/1`}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </TestnetLink>
            )}
          </div>
        </li>
        <li className="list-inline-item">
          {prevCondition ? (
            <div className="pager">
              <span data-testid="disabledPreviousPageButton">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </span>
            </div>
          ) : (
            <div className="pager">
              <TestnetLink to={prevPageNo} data-testid="previousPageButton">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </TestnetLink>
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
          {nextCondition ? (
            <div className="pager">
              <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/${size + 1}`}>
                Next <FontAwesomeIcon icon={faAngleRight} />
              </TestnetLink>
            </div>
          ) : (
            <div className="pager">
              <span data-testid="disabledNextPageButton">
                Next <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </div>
          )}
        </li>

        <li className="list-inline-item">
          <div className="pager">
            {page === 'last' ? (
              <span>
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </span>
            ) : (
              <>
                {!isNaN(Number(lastPage)) && end < total ? (
                  <TestnetLink
                    data-testid="nextPageButton"
                    to={`/${slug}/page/${blocksPager ? 'last' : lastPage}`}
                  >
                    Last <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </TestnetLink>
                ) : (
                  <span>
                    Last <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </span>
                )}
              </>
            )}
          </div>
        </li>
      </ul>
    </div>
  );

  return show ? PagerComponent : null;
};

export default Pager;
