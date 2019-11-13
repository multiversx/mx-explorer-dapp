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
}: {
  slug: string;
  total: number;
  start: number;
  end: number;
}) => {
  let { page } = useParams();
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? `/${slug}` : `/${slug}/page/${size - 1}`;

  return (
    <div className="float-right">
      <span>
        {start.toLocaleString('en')}-{end.toLocaleString('en')} of {total.toLocaleString('en')}
      </span>

      {size === 1 ? (
        <button className="btn btn-sm" disabled data-testid="disabledPreviousPageButton">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      ) : (
        <TestnetLink to={prevPageNo} className="btn btn-sm" data-testid="previousPageButton">
          <FontAwesomeIcon icon={faChevronLeft} />
        </TestnetLink>
      )}

      <span className="ml-1 mr-1">
        {/* Page&nbsp;
        <span data-testid="pageNumber">{size}</span> */}
      </span>
      <TestnetLink
        data-testid="nextPageButton"
        to={`/${slug}/page/${size + 1}`}
        className="btn btn-sm"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </TestnetLink>
    </div>
  );
};

export default Pager;
