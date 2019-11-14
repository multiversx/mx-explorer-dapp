import React from 'react';
import { useParams } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TestnetLink from './../TestnetLink';

const Pager = ({
  slug,
  total,
  start,
  end,
  show,
}: {
  slug: string;
  total: number;
  start: number;
  end: number;
  show: boolean;
}) => {
  let { page } = useParams();
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? `/${slug}` : `/${slug}/page/${size - 1}`;

  const PagerComponent = (
    <div className="float-right mt-3">
      <ul className="list-inline">
        <li className="list-inline-item">
          <span>
            {start.toLocaleString('en')}-{end.toLocaleString('en')} of {total.toLocaleString('en')}
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
          <div className="pager">
            <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/${size + 1}`}>
              Next <FontAwesomeIcon icon={faChevronRight} />
            </TestnetLink>
          </div>
        </li>
      </ul>
    </div>
  );

  return show ? PagerComponent : null;
};

export default Pager;
