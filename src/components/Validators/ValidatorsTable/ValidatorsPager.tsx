import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ValidatorsPager = ({
  total,
  start,
  end,
  show,
  page,
  setPage,
}: {
  total: number | string;
  start: number;
  end: number;
  show: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? 1 : size - 1;

  const goToPrev = () => setPage(prevPageNo);
  const goToNext = () => setPage(size + 1);

  const begin = start > 1 ? start + 1 : start;

  const startEnd = end === 1 ? 1 : `${begin.toLocaleString('en')}-${end.toLocaleString('en')}`;

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
              <p data-testid="previousPageButton" onClick={goToPrev}>
                <FontAwesomeIcon icon={faChevronLeft} /> Prev
              </p>
            </div>
          )}
        </li>
        <li className="ml-2 list-inline-item">
          {end < total ? (
            <div className="pager">
              <p className="link" data-testid="nextPageButton" onClick={goToNext}>
                Next <FontAwesomeIcon icon={faChevronRight} />
              </p>
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

export default ValidatorsPager;
