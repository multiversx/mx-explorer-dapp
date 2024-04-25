import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { formatBigNumber } from 'helpers';
import { faEye, faGavel } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { SortOrderEnum } from 'types';

export interface NodesFiltersUIType {
  allCount?: string | number;
  validatorCount?: string | number;
  observerCount?: string | number;
  auctionListCount?: string | number;
  queueCount?: string | number;
}

export const NodesFilters = ({
  allCount,
  validatorCount,
  observerCount,
  auctionListCount,
  queueCount
}: NodesFiltersUIType) => {
  const {
    unprocessed: {
      queueSize,
      auctionValidators,
      totalObservers,
      totalNodes,
      totalValidatorNodes
    }
  } = useSelector(stakeSelector);
  const [searchParams, setSearchParams] = useSearchParams();

  const { search, status, issues, type, fullHistory } =
    Object.fromEntries(searchParams);

  const nodeStatusLink = (statusValue: string) => {
    const {
      status,
      type,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);

    const nextUrlParams: { [k: string]: string } = {
      ...rest,
      ...(statusValue ? { status: statusValue } : {})
    };

    if (statusValue === 'queued') {
      nextUrlParams.sort = 'position';
      nextUrlParams.order = SortOrderEnum.asc;
    }
    if (statusValue === 'auction') {
      nextUrlParams.sort = 'qualifiedStake';
      nextUrlParams.order = SortOrderEnum.asc;
    }
    setSearchParams(nextUrlParams);
  };

  const nodeTypeLink = (typeValue: string) => {
    const {
      type,
      status,
      issues,
      fullHistory,
      page,
      sort,
      order,
      isAuctionDangerZone,
      isQualified,
      ...rest
    } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const allDisplayBadge = allCount ?? totalNodes;
  const validatorDisplayBadge = validatorCount ?? totalValidatorNodes;
  const observersDisplayBadge = observerCount ?? totalObservers;
  const queueDisplayBadge = queueCount ?? queueSize;
  const auctionDisplayBadge = auctionListCount ?? auctionValidators;

  const isAllActive = [search, status, issues, type, fullHistory].every(
    (el) => el === undefined
  );

  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
      <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
        <li className='list-inline-item me-0'>
          <button
            type='button'
            onClick={() => {
              nodeTypeLink('');
            }}
            className={classNames(
              'btn btn-tab d-flex align-items-center gap-1',
              {
                active: isAllActive
              }
            )}
          >
            All Nodes
            {allDisplayBadge !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: allDisplayBadge })}
              </span>
            )}
          </button>
        </li>
        <li className='list-inline-item me-0'>
          <button
            type='button'
            onClick={() => {
              nodeTypeLink('validator');
            }}
            className={classNames(
              'btn btn-tab d-flex align-items-center gap-1',
              { active: type === 'validator' && issues !== 'true' }
            )}
          >
            Validator Nodes
            {validatorDisplayBadge !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: validatorDisplayBadge })}
              </span>
            )}
          </button>
        </li>
        <li className='list-inline-item me-0'>
          <button
            type='button'
            onClick={() => {
              nodeTypeLink('observer');
            }}
            data-testid='filterByObservers'
            className={classNames(
              'btn btn-tab d-flex align-items-center gap-1',
              { active: type === 'observer' }
            )}
          >
            <FontAwesomeIcon icon={faEye} />
            Observers
            {observersDisplayBadge !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: observersDisplayBadge })}
              </span>
            )}
          </button>
        </li>
        {auctionValidators !== undefined && (
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeStatusLink('auction');
              }}
              data-testid='filterByValidators'
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: status === 'auction' }
              )}
            >
              <FontAwesomeIcon icon={faGavel} />
              Auction List
              {auctionDisplayBadge !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: auctionDisplayBadge })}
                </span>
              )}
            </button>
          </li>
        )}
        {queueSize !== undefined && (
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeStatusLink('queued');
              }}
              data-testid='filterByValidators'
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: status === 'queued' }
              )}
            >
              Queued
              {queueDisplayBadge !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: queueDisplayBadge })}
                </span>
              )}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
