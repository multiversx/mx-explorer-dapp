import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams } from 'react-router-dom';
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
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? `/${slug}` : `/${slug}/page/${size - 1}`;

  const startEnd = end === 1 ? 1 : `${start.toLocaleString('en')}-${end.toLocaleString('en')}`;

  const PagerComponent = (
    <div className="float-right mt-3">
      <ul className="list-inline">
        <li className="list-inline-item">
          <span>
            <span data-testid="pageInterval">{startEnd}</span>
            &nbsp;of&nbsp;
            <span data-testid="totalPages">{total.toLocaleString('en')}</span>
          </span>
        </li>
        <li className="list-inline-item ml-2 mr-2">
          {size === 1 ? (
            <div className="pager">
              <span data-testid="disabledPreviousPageButton">
                <FontAwesomeIcon icon={faChevronLeft} /> Prev
              </span>
            </div>
          ) : (
            <div className="pager">
              <TestnetLink to={prevPageNo} data-testid="previousPageButton">
                <FontAwesomeIcon icon={faChevronLeft} /> Prev
              </TestnetLink>
            </div>
          )}
        </li>
        <li className="ml-2 list-inline-item">
          {end < total ? (
            <div className="pager">
              <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/${size + 1}`}>
                Next <FontAwesomeIcon icon={faChevronRight} />
              </TestnetLink>
            </div>
          ) : (
            <div className="pager">
              <span data-testid="disabledNextPageButton">
                Next <FontAwesomeIcon icon={faChevronRight} />
              </span>
            </div>
          )}
        </li>
      </ul>
    </div>
  );

  return show ? PagerComponent : null;
};

export default Pager;
