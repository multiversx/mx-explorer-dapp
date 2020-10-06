import { faAngleLeft } from '@fortawesome/pro-solid-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons/faAngleRight';
import { faAngleDoubleRight } from '@fortawesome/pro-solid-svg-icons/faAngleDoubleRight';
import { faAngleDoubleLeft } from '@fortawesome/pro-solid-svg-icons/faAngleDoubleLeft';
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

  const correction = size === 2 ? 0 : 1;
  const lastPage = Math.ceil(parseInt(total.toString()) / (end - start + correction));

  const goToFirst = () => setPage(1);
  const goToPrev = () => setPage(prevPageNo);
  const goToNext = () => setPage(size + 1);
  const goToLast = () => setPage(lastPage);

  const begin = start > 1 ? start + 1 : start;

  const startEnd = end === 1 ? 1 : `${begin.toLocaleString('en')}-${end.toLocaleString('en')}`;

  const PagerComponent = (
    <div className="float-right mt-3">
      <ul className="list-inline">
        <li className="list-inline-item">
          <div className="pager">
            {size === 1 ? (
              <span>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </span>
            ) : (
              <p data-testid="previousPageButton" onClick={goToFirst}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </p>
            )}
          </div>
        </li>

        <li className="list-inline-item">
          {size === 1 ? (
            <div className="pager">
              <span data-testid="disabledPreviousPageButton">
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </span>
            </div>
          ) : (
            <div className="pager">
              <p data-testid="previousPageButton" onClick={goToPrev}>
                <FontAwesomeIcon icon={faAngleLeft} /> Prev
              </p>
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
          {end < total ? (
            <div className="pager">
              <p className="link" data-testid="nextPageButton" onClick={goToNext}>
                Next <FontAwesomeIcon icon={faAngleRight} />
              </p>
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
            {!isNaN(lastPage) && end < total ? (
              <p className="link" onClick={goToLast}>
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </p>
            ) : (
              <span>
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </span>
            )}
          </div>
        </li>
      </ul>
    </div>
  );

  return show ? PagerComponent : null;
};

export default ValidatorsPager;
