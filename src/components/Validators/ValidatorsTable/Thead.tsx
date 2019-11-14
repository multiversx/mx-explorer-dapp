import React, { SyntheticEvent } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import { HeadersType, getNewSortData } from './../helpers/validatorHelpers';
import { ShardSpan } from './../../../sharedComponents';
import { SortType, ComputedShard } from './index';

const headers: HeadersType[] = [
  {
    id: 'hexPublicKey',
    label: 'Public Key',
    dir: 'none',
  },
  {
    id: 'nodeDisplayName',
    label: 'Node Name',
    dir: 'none',
  },
  {
    id: 'shardID',
    label: 'Shard',
    dir: 'none',
  },
  {
    id: 'versionNumber',
    label: 'Version',
    dir: 'none',
  },
  {
    id: 'totalUpTimeSec',
    label: 'Uptime',
    dir: 'none',
  },
  {
    id: 'isActive',
    label: 'Status',
    dir: 'none',
  },
];

type ValidatorsTableHeaderType = {
  includeObservers: boolean;
  sortBy: Function;
  sort: SortType;
  shardData: ComputedShard[];
  shardValue: string;
  setShardValue: React.Dispatch<React.SetStateAction<string>>;
  statusValue: string;
  setStatusValue: React.Dispatch<React.SetStateAction<string>>;
  validatorObserverValue: string;
  setValidatorObserverValue: React.Dispatch<React.SetStateAction<string>>;
};

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
}: ValidatorsTableHeaderType) => {
  const toggleSort = (currentSortColumn: string) => () => {
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
        {headers.map(header => (
          <th
            className={`sortable ${header.id === 'totalUpTimeSec' ? 'text-right' : ''}`}
            key={header.id}
          >
            <span onClick={toggleSort(header.id)}>{header.label}&nbsp;</span>
            {sort.dir === 'asc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowUp} className="empty-icon" />
            )}
            {sort.dir === 'desc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowDown} className="empty-icon" />
            )}
            {header.id === 'hexPublicKey' && includeObservers && (
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
                          validatorObserverValue === 'validator' ? 'active' : ''
                        }`}
                        href="#/validators"
                        onClick={e => changeValidatorObserver(e, 'online')}
                      >
                        Validator
                      </a>
                      <a
                        className={`nav-link ${
                          validatorObserverValue === 'observer' ? 'active' : ''
                        }`}
                        href="#/validators"
                        onClick={e => changeValidatorObserver(e, 'offline')}
                      >
                        Observer
                      </a>
                      <a
                        className={`nav-link ${validatorObserverValue === '' ? 'active' : ''}`}
                        key={-1}
                        href="#/validators"
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
                  className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-blockinline-"
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
                      {shardData.map(({ shardNumber, shardID }) => {
                        return (
                          <a
                            className={`nav-link ${shardValue === shardID ? 'active' : ''}`}
                            key={shardNumber}
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
                      >
                        Online
                      </a>
                      <a
                        className={`nav-link ${statusValue === 'offline' ? 'active' : ''}`}
                        href="#/validators"
                        onClick={e => changeStatus(e, 'offline')}
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
                  className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-blockinline-"
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
