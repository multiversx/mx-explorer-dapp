import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { HeadersType, getNewSortData } from './../helpers/validatorHelpers';
import { SortType } from './index';

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
};

const ValidatorsTableHeader = ({ includeObservers, sortBy, sort }: ValidatorsTableHeaderType) => {
  const toggleSort = (currentSortColumn: string) => () => {
    const { field: oldSortColumn, dir: oldDir } = sort;
    const { field, dir } = getNewSortData({ oldDir, oldSortColumn, currentSortColumn });
    sortBy({ field, dir });
  };
  return (
    <thead>
      <tr>
        {headers.map(header => (
          <th className="sortable" key={header.id}>
            <span onClick={toggleSort(header.id)} ng-click="toggleSort($index)">
              {header.label}
            </span>
            {sort.dir === 'asc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowUp} className="empty-icon" />
            )}
            {sort.dir === 'desc' && sort.field === header.id && (
              <FontAwesomeIcon icon={faArrowDown} className="empty-icon" />
            )}
            {header.id == 'hexPublicKey' && includeObservers && (
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
