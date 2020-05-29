import { faArrowDown, faArrowUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { SyntheticEvent } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { ShardSpan } from './../../../sharedComponents';
import { getNewSortData } from './../helpers/validatorHelpers';
import { ComputedShard, SortType } from './index';
import headers from './headers';

interface ValidatorsTableHeaderType {
  includeObservers: boolean;
  sortBy: ({ field, dir }: { field: string; dir: 'none' | 'asc' | 'desc' }) => void;
  sort: SortType;
  shardData: ComputedShard[];
  shardValue: string;
  setShardValue: React.Dispatch<React.SetStateAction<string>>;
  statusValue: string;
  setStatusValue: React.Dispatch<React.SetStateAction<string>>;
  validatorObserverValue: string;
  setValidatorObserverValue: React.Dispatch<React.SetStateAction<string>>;
  hasWaitingValidators: boolean;
  isInitialRatingDesc: boolean;
  setIsInitialRatingDesc: React.Dispatch<React.SetStateAction<boolean>>;
}

const ValidatorsTableHeader = ({
  includeObservers,
  sortBy,
  sort,
  shardData,
  shardValue,
  setShardValue,
  statusValue,
  setStatusValue,
  validatorObserverValue,
  setValidatorObserverValue,
  hasWaitingValidators,
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

  const changeValidatorObserver = (e: SyntheticEvent, validatorObs: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setValidatorObserverValue(validatorObs);
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
            {header.id === 'publicKey' && (hasWaitingValidators || includeObservers) && (
              <OverlayTrigger
                trigger="click"
                key="popover"
                placement="bottom"
                rootClose
                overlay={
                  <Popover id="popover-positioned-bottom">
                    <Popover.Content>
                      <a
                        className={`nav-link ${
                          validatorObserverValue === 'eligible' ? 'active' : ''
                        }`}
                        href="#/validators"
                        data-testid="filterByValidators"
                        onClick={e => changeValidatorObserver(e, 'eligible')}
                      >
                        Validator{hasWaitingValidators ? ' (eligible)' : ''}
                      </a>
                      {hasWaitingValidators && (
                        <a
                          className={`nav-link ${
                            validatorObserverValue === 'waiting' ? 'active' : ''
                          }`}
                          href="#/validators"
                          data-testid="filterByValidators"
                          onClick={e => changeValidatorObserver(e, 'waiting')}
                        >
                          Validator (waiting)
                        </a>
                      )}

                      {includeObservers && (
                        <a
                          className={`nav-link ${
                            validatorObserverValue === 'observer' ? 'active' : ''
                          }`}
                          href="#/validators"
                          data-testid="filterByObservers"
                          onClick={e => changeValidatorObserver(e, 'observer')}
                        >
                          Observer
                        </a>
                      )}

                      <a
                        className={`nav-link ${validatorObserverValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
                        data-testid="clearFilterValidatorObserver"
                        onClick={e => changeValidatorObserver(e, '')}
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
                  data-testid="filterValidatorObserver"
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    className={validatorObserverValue !== '' ? 'text-primary' : ''}
                  />
                </span>
              </OverlayTrigger>
            )}
            {header.id === 'shardID' && (
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
                            onClick={e => changeShard(e, shardID)}
                          >
                            <ShardSpan shardId={shardNumber} />
                          </a>
                        );
                      })}
                      <a
                        className={`nav-link ${shardValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
                        onClick={e => changeShard(e, '')}
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
            {header.id === 'isActive' && (
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
                        onClick={e => changeStatus(e, 'online')}
                        data-testid="filterByStatusOnline"
                      >
                        Online
                      </a>
                      <a
                        className={`nav-link ${statusValue === 'offline' ? 'active' : ''}`}
                        href="#/validators"
                        onClick={e => changeStatus(e, 'offline')}
                        data-testid="filterByStatusOffline"
                      >
                        Offiline
                      </a>
                      <a
                        className={`nav-link ${statusValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
                        onClick={e => changeStatus(e, '')}
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
