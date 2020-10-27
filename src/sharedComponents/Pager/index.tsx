import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import { faAngleDoubleRight } from '@fortawesome/pro-regular-svg-icons/faAngleDoubleRight';
import { faAngleDoubleLeft } from '@fortawesome/pro-regular-svg-icons/faAngleDoubleLeft';
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
  const { page } = useParams() as any;
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const prevPageNo = size === 2 ? `/${slug}` : `/${slug}/page/${size - 1}`;

  const last = !isNaN(parseInt(total.toString())) ? Math.min(end, parseInt(total.toString())) : end;

  const startEnd = end === 1 ? 1 : `${start.toLocaleString('en')}-${last.toLocaleString('en')}`;

  const correction = size > 2 ? 0 : 1;
  const lastPage = Math.ceil(parseInt(total.toString()) / (end - start + correction));

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
              <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/1`}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} /> First
              </TestnetLink>
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
          {end < total ? (
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
            {!isNaN(lastPage) && end < total ? (
              <TestnetLink data-testid="nextPageButton" to={`/${slug}/page/${lastPage}`}>
                Last <FontAwesomeIcon icon={faAngleDoubleRight} />
              </TestnetLink>
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

export default Pager;
