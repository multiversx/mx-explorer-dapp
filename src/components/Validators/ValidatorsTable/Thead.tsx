import { faArrowDown } from '@fortawesome/pro-regular-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/pro-regular-svg-icons/faArrowUp';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SyntheticEvent } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { ShardSpan } from 'sharedComponents';
import { getNewSortData } from './../helpers/validatorHelpers';
import { ComputedShard, SortType } from './Table';
import headers from './headers';

interface ValidatorsTableHeaderType {
  sortBy: ({ field, dir }: { field: string; dir: 'none' | 'asc' | 'desc' }) => void;
  sort: SortType;
  total: number;
  shardData: ComputedShard[];
  shardValue: string;
  setShardValue: React.Dispatch<React.SetStateAction<string>>;
  statusValue: string;
  setStatusValue: React.Dispatch<React.SetStateAction<string>>;
  validatorObserverValue: string;
  isInitialRatingDesc: boolean;
  setIsInitialRatingDesc: React.Dispatch<React.SetStateAction<boolean>>;
}

const ValidatorsTableHeader = ({
  sortBy,
  sort,
  total,
  shardData,
  shardValue,
  setShardValue,
  statusValue,
  setStatusValue,
  isInitialRatingDesc,
  setIsInitialRatingDesc,
}: ValidatorsTableHeaderType) => {
  const toggleSort = (currentSortColumn: string) => () => {
    if (currentSortColumn === 'ratingOrder') {
      return;
    }
    if (currentSortColumn === 'rating') {
      setIsInitialRatingDesc(false);
    }
    const { field: oldSortColumn, dir: oldDir } = sort;
    const { field, dir } = getNewSortData({ oldDir, oldSortColumn, currentSortColumn });
    sortBy({ field, dir });
  };

  const changeShard = (e: SyntheticEvent, shardID: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setShardValue(shardID);
  };

  const changeStatus = (e: SyntheticEvent, status: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setStatusValue(status);
  };

  return (
    <thead>
      <tr>
        {headers.map((header, i) => (
          <th
            className={`sortable 
              ${['totalUpTimeSec', 'rating'].includes(header.id) ? 'text-right' : ''}
              ${header.label === 'Status' ? 'text-right' : ''}`}
            key={header.id}
          >
            <span onClick={toggleSort(header.id)}>{header.label}&nbsp;</span>
            {sort.dir === 'asc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowUp} className="empty-icon" />
            )}
            {sort.dir === 'desc' && sort.field === header.id && (
              <FontAwesomeIcon
                icon={faArrowDown}
                className={sort.field === 'rating' && isInitialRatingDesc ? 'd-none' : 'empty-icon'}
              />
            )}
            {header.id === 'shardID' && total > 0 && (
              <OverlayTrigger
                trigger="click"
                key="popover"
                placement="bottom"
                rootClose
                overlay={
                  <Popover id="popover-positioned-bottom">
                    <Popover.Content>
                      {shardData.map(({ shardNumber, shardID }, i) => {
                        return (
                          <a
                            className={`nav-link ${shardValue === shardID ? 'active' : ''}`}
                            key={shardNumber + i}
                            href="#/validators"
                            onClick={(e) => changeShard(e, shardID)}
                          >
                            <ShardSpan shardId={shardNumber} />
                          </a>
                        );
                      })}
                      <a
                        className={`nav-link ${shardValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
                        onClick={(e) => changeShard(e, '')}
                      >
                        Show all
                      </a>
                    </Popover.Content>
                  </Popover>
                }
              >
                <span
                  id="switch"
                  className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-block"
                  data-testid="shardFilterButton"
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    className={shardValue !== '' ? 'text-primary' : ''}
                  />
                </span>
              </OverlayTrigger>
            )}
            {header.id === 'isActive' && total > 0 && (
              <OverlayTrigger
                trigger="click"
                key="popover"
                placement="bottom"
                rootClose
                overlay={
                  <Popover id="popover-positioned-bottom">
                    <Popover.Content>
                      <a
                        className={`nav-link ${statusValue === 'online' ? 'active' : ''}`}
                        href="#/validators"
                        onClick={(e) => changeStatus(e, 'online')}
                        data-testid="filterByStatusOnline"
                      >
                        Online
                      </a>
                      <a
                        className={`nav-link ${statusValue === 'offline' ? 'active' : ''}`}
                        href="#/validators"
                        onClick={(e) => changeStatus(e, 'offline')}
                        data-testid="filterByStatusOffline"
                      >
                        Offiline
                      </a>
                      <a
                        className={`nav-link ${statusValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
                        onClick={(e) => changeStatus(e, '')}
                      >
                        Show all
                      </a>
                    </Popover.Content>
                  </Popover>
                }
              >
                <span
                  id="switch"
                  className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-block"
                  data-testid="filterByStatus"
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    className={statusValue !== '' ? 'text-primary' : ''}
                  />
                </span>
              </OverlayTrigger>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ValidatorsTableHeader;
