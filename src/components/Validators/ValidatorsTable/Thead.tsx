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
};

const ValidatorsTableHeader = ({
  includeObservers,
  sortBy,
  sort,
  shardData,
  shardValue,
  setShardValue,
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
    setShardValue(shardID);
  };

  return (
    <thead>
      <tr>
        {headers.map(header => (
          <th className="sortable" key={header.id}>
            <span onClick={toggleSort(header.id)}>{header.label}&nbsp;</span>
            {sort.dir === 'asc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowUp} className="empty-icon" />
            )}
            {sort.dir === 'desc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowDown} className="empty-icon" />
            )}
            {header.id === 'hexPublicKey' && includeObservers && (
              <span className="dropdown">
                {/* <span data-toggle="dropdown">
                <i
                  className="fa fa-filter"
                  ng-class="{'text-primary': (validatorObserverValue !== '')}"
                />
              </span> */}
                {/* <div className="dropdown-menu">
                <div>
                  <span
                    ng-click="filterByValidatorObserver('validator')"
                    className="dropdown-item"
                    ng-class="{'font-weight-bold': (validatorObserverValue == 'validator')}"
                  >
                    Validator
                  </span>
                </div>
                <div>
                  <span
                    ng-click="filterByValidatorObserver('observer')"
                    className="dropdown-item"
                    ng-class="{'font-weight-bold': (validatorObserverValue == 'observer')}"
                  >
                    Observer
                  </span>
                </div>
                <div>
                  <span
                    ng-click="filterByValidatorObserver('')"
                    className="dropdown-item"
                    ng-class="{'font-weight-bold': (validatorObserverValue == '')}"
                  >
                    Show all
                  </span>
                </div>
              </div> */}
              </span>
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
                  className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-blockinline-"
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    className="switch d-none d-md-inline-block d-lg-inline-block d-xl-inline-blockinline-"
                  />
                </span>
              </OverlayTrigger>
            )}
            <span ng-show="headers[$index].id == 'shardID'" className="dropdown">
              {/* <span data-toggle="dropdown">
              <i
                className="fa fa-filter"
                ng-class="{'text-primary': (shardValue !== '')}"
              />
            </span> */}
              {/* <div className="dropdown-menu">
              <div ng-repeat="shard in shardsList | orderBy:shard">
                <span
                  ng-click="filterByShard(shard)"
                  className="dropdown-item"
                  ng-class="{'font-weight-bold': (shard == shardValue)}"
                >
                  {'{'}
                  {'{'}shard == 'Metachain' ? shard : 'Shard ' + shard{'}'}
                  {'}'}
                </span>
              </div>
              <div>
                <span
                  ng-click="filterByShard('')"
                  className="dropdown-item"
                  ng-class="{'font-weight-bold': (shardValue == '')}"
                >
                  Show all
                </span>
              </div>
            </div> */}
            </span>
            <span ng-show="headers[$index].id == 'isActive'" className="dropdown">
              {/* <span data-toggle="dropdown">
              <i
                className="fa fa-filter"
                ng-class="{'text-primary': (statusValue !== '')}"
              />
            </span> */}
              {/* <div className="dropdown-menu">
              <span
                ng-click="filterByStatus(true)"
                className="dropdown-item"
                ng-class="{'font-weight-bold': (statusValue === true)}"
              >
                Online
              </span>
              <span
                ng-click="filterByStatus(false)"
                className="dropdown-item"
                ng-class="{'font-weight-bold': (statusValue === false)}"
              >
                Offline
              </span>
              <span
                ng-click="filterByStatus('')"
                className="dropdown-item"
                ng-class="{'font-weight-bold': (statusValue === '')}"
              >
                Show all
              </span>
            </div> */}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default ValidatorsTableHeader;
