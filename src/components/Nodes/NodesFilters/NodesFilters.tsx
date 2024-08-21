import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { formatBigNumber } from 'helpers';
import { useGetNodesCategoryCount } from 'hooks';
import { faEye, faGavel } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { SortOrderEnum, NodeStatusEnum, NodeTypeEnum } from 'types';

export interface NodesFiltersUIType {
  showGlobalValues?: boolean;
  showObservers?: boolean;
  showValidatorNodes?: boolean;
}

export const NodesFilters = ({
  showObservers,
  showValidatorNodes,
  showGlobalValues
}: NodesFiltersUIType) => {
  const {
    unprocessed: { queueSize, auctionValidators }
  } = useSelector(stakeSelector);

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    status,
    type,
    issues,
    fullHistory,
    page,
    sort,
    order,
    search,
    isAuctioned,
    isAuctionDangerZone,
    isQualified,
    ...rest
  } = Object.fromEntries(searchParams);

  const {
    totalNodes,
    totalValidatorNodes,
    queueSize: displayQueueSize,
    auctionValidators: displayAuctionValidators,
    totalObservers
  } = useGetNodesCategoryCount({ showGlobalValues });

  const nodeStatusLink = (statusValue: string) => {
    const nextUrlParams: { [k: string]: string } = {
      ...rest,
      ...(statusValue ? { status: statusValue } : {})
    };

    if (statusValue === NodeStatusEnum.queued) {
      nextUrlParams.sort = 'position';
      nextUrlParams.order = SortOrderEnum.asc;
    }
    if (statusValue === NodeStatusEnum.auction || isAuctioned) {
      nextUrlParams.sort = 'qualifiedStake';
      nextUrlParams.order = SortOrderEnum.desc;
    }
    setSearchParams(nextUrlParams);
  };

  const nodeAuctionLink = (auction: boolean) => {
    const nextUrlParams: { [k: string]: string } = {
      ...rest,
      ...(auction ? { isAuctioned: String(auction) } : {})
    };

    nextUrlParams.sort = 'qualifiedStake';
    nextUrlParams.order = SortOrderEnum.desc;

    setSearchParams(nextUrlParams);
  };

  const nodeTypeLink = (typeValue: string) => {
    const nextUrlParams = {
      ...rest,
      ...(typeValue ? { type: typeValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const isAllActive =
    [type, isAuctioned].every((el) => el === undefined) &&
    status !== NodeStatusEnum.queued;

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
            {totalNodes !== undefined && (
              <span className='badge badge-sm'>
                {formatBigNumber({ value: totalNodes })}
              </span>
            )}
          </button>
        </li>
        {showValidatorNodes && (
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeTypeLink(NodeTypeEnum.validator);
              }}
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                {
                  active: type === NodeTypeEnum.validator && !isAuctioned
                }
              )}
            >
              Validator Nodes
              {totalValidatorNodes !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: totalValidatorNodes })}
                </span>
              )}
            </button>
          </li>
        )}
        {auctionValidators !== undefined && (
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeAuctionLink(true);
              }}
              data-testid='filterByValidators'
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: isAuctioned }
              )}
            >
              <FontAwesomeIcon icon={faGavel} />
              Auction List
              {displayAuctionValidators !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: displayAuctionValidators })}
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
                nodeStatusLink(NodeStatusEnum.queued);
              }}
              data-testid='filterByValidators'
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                {
                  active:
                    status === NodeStatusEnum.queued &&
                    !isAuctioned &&
                    type === undefined
                }
              )}
            >
              Queued
              {displayQueueSize !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: displayQueueSize })}
                </span>
              )}
            </button>
          </li>
        )}
        {showObservers && (
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeTypeLink(NodeTypeEnum.observer);
              }}
              data-testid='filterByObservers'
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: type === NodeTypeEnum.observer && !isAuctioned }
              )}
            >
              <FontAwesomeIcon icon={faEye} />
              Observers
              {totalObservers !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: totalObservers })}
                </span>
              )}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
