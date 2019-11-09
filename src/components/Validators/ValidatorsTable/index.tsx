import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faEye } from '@fortawesome/free-solid-svg-icons';
import { ValidatorType } from './../index';
import { truncate } from './../../../helpers';

const directions = ['asc', 'desc', 'none'];

const headers = [
  {
    id: 'hexPublicKey',
    label: 'Public Key',
  },
  {
    id: 'nodeDisplayName',
    label: 'Node Name',
  },
  {
    id: 'shardID',
    label: 'Shard',
  },
  {
    id: 'versionNumber',
    label: 'Version',
  },
  {
    id: 'totalUpTimeSec',
    label: 'Uptime',
  },
  {
    id: 'isActive',
    label: 'Status',
  },
];

type ComputedShard = {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
};

export type StateType = {
  shardData: ComputedShard[];
  shardsList: string[];
  validatorsLength: number;
  filteredValidators: ValidatorType[];
  filteredValidatorsLength: number;
  shownValidatorsLength: number;
  validatorsAndObserversLength: number;
};

export const initialState: StateType = {
  shardData: [
    {
      shardID: '',
      status: '',
      allValidators: 0,
      allActiveValidators: 0,
    },
  ],
  shardsList: [''],
  validatorsLength: 0,
  filteredValidators: [
    {
      computedShardID: 0,
      hexPublicKey: '',
      isActive: false,
      isValidator: false,
      maxInactiveTime: '',
      nodeDisplayName: '',
      receivedShardID: 0,
      timeStamp: '',
      totalDownTimeSec: 0,
      totalUpTimeSec: 0,
      versionNumber: '',
    },
  ],
  filteredValidatorsLength: 0,
  shownValidatorsLength: 0,
  validatorsAndObserversLength: 0,
};

const ValidatorsTable = (props: StateType) => {
  const includeObservers = false;
  const validatorInfosEnabled = false;
  const { filteredValidatorsLength, filteredValidators, shownValidatorsLength } = props;
  return (
    <div className="row pb-3">
      <div className="col-12">
        <div className="card">
          {/* <div ng-show="errorLoadingValidators != ''" className="card-body card-details">
            <div className="empty">
              <i className="fa fa-server empty-icon" />
              <span className="h4 empty-heading">
                {'{'}
                {'{'}errorLoadingValidators{'}'}
                {'}'}
              </span>
            </div>
          </div> */}
          <div ng-show="errorLoadingValidators == ''" className="card-body card-list">
            <div className="float-right">
              <form ng-submit="filterValidators()" name="filterForm" role="search">
                <div className="input-group input-group-seamless">
                  <input
                    type="text"
                    className="form-control"
                    ng-model="validatorValue"
                    ng-change="filterValidators()"
                    placeholder="Search"
                    name="validatorSearch"
                    style={{ borderRadius: '2rem' }}
                    required
                  />
                  <div className="input-group-append">
                    <button
                      type="submit"
                      className="input-group-text"
                      ng-show="!(validatorValue.length > 0)"
                    >
                      <i className="fa fa-search" />
                    </button>
                    <button
                      type="reset"
                      className="input-group-text"
                      ng-show="validatorValue.length > 0"
                      ng-click="clearValidatorValue()"
                    >
                      <i className="fa fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="float-right mt-2 mr-4">
              <label>
                <input
                  type="checkbox"
                  name="checkbox"
                  defaultValue="value"
                  ng-model="includeObservers"
                  ng-change="toggleActive(includeObservers)"
                />
                Include observers
              </label>
            </div>
            <div className="mt-2 d-none d-md-block">
              {shownValidatorsLength
                ? 'Showing ' +
                  filteredValidatorsLength.toLocaleString('en') +
                  ' of ' +
                  shownValidatorsLength.toLocaleString('en')
                : ''}
            </div>
            <div className="table-responsive" style={{ minHeight: '290px' }}>
              <table className="table mt-4">
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th className="sortable" key={header.id}>
                        <span ng-click="toggleSort($index)">{header.label}</span>
                        {/* {header.dir === 'asc' && (
                          <FontAwesomeIcon icon={faArrowUp} className="empty-icon" />
                        )}
                        {header.dir === 'desc' && (
                          <FontAwesomeIcon icon={faArrowDown} className="empty-icon" />
                        )} */}
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
                <tbody>
                  {filteredValidators.map(validator => (
                    <tr className="animated fadeIn" key={validator.hexPublicKey}>
                      <td>
                        {!validator.isValidator && (
                          <FontAwesomeIcon icon={faEye} className="w300" />
                        )}
                        {validatorInfosEnabled ? (
                          <a
                            href="#/validator/{{validator.hexPublicKey}}"
                            ng-show="validatorInfosEnabled"
                          >
                            {truncate(validator.hexPublicKey, 20)}
                          </a>
                        ) : (
                          <span ng-show="validatorInfosEnabled == false">
                            {truncate(validator.hexPublicKey, 20)}
                          </span>
                        )}
                      </td>
                      <td>
                        {validator.nodeDisplayName ? (
                          truncate(validator.nodeDisplayName, 20)
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {validator.shardId != 'Metachain' ? (
                          <a href="/#/shard/{{ validator.shardID }}/page/1">
                            Shard {validator.shardId}
                            <span ng-show="validator.star === true">*</span>
                          </a>
                        ) : (
                          <a href="/#/shard/{{ validator.shardNumber }}/page/1">
                            Metachain
                            {validator.star && <span>*</span>}
                          </a>
                        )}
                      </td>
                      <td>{truncate(validator.versionNumber, 20)}</td>
                      <td className="text-right">
                        {(validator.totalUpTimeSec != 0 || validator.totalDownTimeSec != 0) && (
                          <span>
                            {Math.floor(
                              (validator.totalUpTimeSec * 100) /
                                (validator.totalUpTimeSec + validator.totalDownTimeSec)
                            )}
                            %
                          </span>
                        )}
                        {validator.totalUpTimeSec == 0 &&
                          validator.totalDownTimeSec == 0 &&
                          validator.isActive === true && <span>100%</span>}
                        {validator.totalUpTimeSec == 0 &&
                          validator.totalDownTimeSec == 0 &&
                          validator.isActive === false && <span ng-show="">0%</span>}
                      </td>
                      <td>
                        {validator.isActive === true ? (
                          <div>
                            <span className="badge badge-pill badge-success badge-status">
                              &nbsp;
                            </span>
                            <span>Online</span>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-pill badge-danger badge-status">
                              &nbsp;
                            </span>
                            <span className={validator.isValidator === false ? 'text-muted' : ''}>
                              Offline
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr ng-show="!filteredValidators">
                    <td colSpan={6} className="text-center pt-5 pb-4 border-0">
                      <div className="lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
