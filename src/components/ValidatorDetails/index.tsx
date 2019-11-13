import * as React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { BlocksTable, TestnetLink, ShardSpan } from '../../sharedComponents';
import { useGlobalState } from '../../context';
import { getValidator } from './helpers/asyncRequests';
import { truncate } from '../../helpers';

export type StateType = {
  shardId: string;
  publicKey: string;
  shardNumber: number;
  versionNumber: string;
  isActive: boolean;
  nodeDisplayName: string;
  isValidator: boolean;
  publicKeyBlockSign: string;
  totalDownTimePercentege: number;
  totalUpTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
  instanceType: number;
  blocks: [];
  startBlockNr: number;
  endBlockNr: number;
  rounds: [];
  success: boolean;
};

export const initialState: StateType = {
  shardId: '0',
  publicKey: '',
  shardNumber: 0,
  versionNumber: '0',
  isActive: false,
  nodeDisplayName: '0',
  isValidator: false,
  publicKeyBlockSign: '0',
  totalDownTimePercentege: 0,
  totalUpTimePercentege: 0,
  totalUpTimeLabel: '',
  totalDownTimeLabel: '',
  instanceType: 0,
  blocks: [],
  startBlockNr: 0,
  endBlockNr: 0,
  rounds: [],
  success: true,
};

const ValidatorDetails = () => {
  let { hash: hexPublicKey } = useParams();

  let ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl, nodeUrl },
    config: { metaChainShardId },
    timeout,
  } = useGlobalState();

  const [state, setState] = React.useState(initialState);
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    if (ref.current !== null) {
      getValidator({
        elasticUrl,
        timeout: Math.max(timeout, 6000),
        hexPublicKey: hexPublicKey || '',
        metaChainShardId,
        nodeUrl,
      }).then((data: any) => {
        ref.current !== null && setState(data);
        ref.current !== null && setSuccess(data.success);
      });
    }
  }, [elasticUrl, timeout, hexPublicKey, nodeUrl, metaChainShardId]); // run the operation only once since the parameter does not change

  const {
    publicKeyBlockSign,
    nodeDisplayName,
    shardNumber,
    publicKey,
    instanceType,
    versionNumber,
    isValidator,
    isActive,
    blocks,
    totalUpTimePercentege,
    totalDownTimePercentege,
    totalUpTimeLabel,
    totalDownTimeLabel,
    // code,
    rounds,
  } = state;

  return (
    <div ref={ref}>
      <div className="container pt-4 pb-3">
        <div className="row mb-2">
          <div className="col-12">
            <h4>Node Information</h4>
          </div>
        </div>
        {success ? (
          <>
            {publicKey !== '' ? (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-2 card-label">Public Key</div>
                          <div className="col-lg-10">{truncate(hexPublicKey, 100)}</div>
                        </div>
                        <hr className="hr-space" />
                        {publicKeyBlockSign !== undefined && (
                          <div ng-show="">
                            <div className="row">
                              <div className="col-lg-2 card-label">Public key BlockSign</div>
                              <div className="col-lg-10">missing</div>
                            </div>
                            <hr className="hr-space" />
                          </div>
                        )}

                        <div className="row">
                          <div className="col-lg-2 card-label">Shard</div>
                          <div className="col-lg-10">
                            <TestnetLink to={`/shards/${shardNumber}`}>
                              <ShardSpan shardId={shardNumber} />
                            </TestnetLink>
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Name</div>
                          <div className="col-lg-10">
                            {nodeDisplayName ? (
                              nodeDisplayName
                            ) : (
                              <span className="text-muted" ng-show="!nodeDisplayName">
                                N/A
                              </span>
                            )}
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Type</div>
                          <div className="col-lg-10">{instanceType}</div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Version</div>
                          <div className="col-lg-10">{versionNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className={isValidator ? 'col-md-7' : 'col-12'}>
                    <div className="mt-4">
                      <h4>Network Metrics</h4>
                    </div>
                    <div className="card" style={{ height: 'auto' }}>
                      <div className={isValidator ? 'card-body mt-2 mb-3' : 'card-body'}>
                        <div className="row">
                          <div className="col-lg-2 card-label">Status</div>
                          <div className="col-lg-10">
                            {isActive ? (
                              <div ng-if="isActive === true">
                                <span className="badge badge-pill badge-success badge-status">
                                  &nbsp;
                                </span>
                                <span>&nbsp;Online</span>
                              </div>
                            ) : (
                              <div ng-if="isActive === false">
                                <span className="badge badge-pill badge-danger badge-status">
                                  &nbsp;
                                </span>
                                <span className={isValidator === false ? 'text-muted' : ''}>
                                  &nbsp;Offline
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <hr className="hr-space" />
                        <div className="row">
                          <div className="col-lg-2 card-label">Uptime</div>
                          <div className="col-lg-10">
                            {totalUpTimePercentege + totalDownTimePercentege > 0 ? (
                              <div className="progress">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderProgressTooltip({ label: totalUpTimeLabel })}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: totalUpTimePercentege + '%' }}
                                    id="upTimePercentegeBar"
                                  ></div>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderProgressTooltip({ label: totalDownTimeLabel })}
                                >
                                  <div
                                    className="progress-bar bg-danger"
                                    style={{ width: totalDownTimePercentege + '%' }}
                                    id="downTimePercentegeBar"
                                  ></div>
                                </OverlayTrigger>
                              </div>
                            ) : (
                              <div className="progress">
                                <div
                                  className="progress-bar bg-success"
                                  ng-style="{width: '100%'}"
                                  id="upTimePercentegeBar"
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* {code && (
                          <>
                            <hr className="hr-space" />
                            <div className="row">
                              <div className="col-lg-2 card-label">Code</div>
                              <div className="col-lg-10">
                                <textarea
                                  readOnly
                                  className="form-control col-lg-12 cursor-text"
                                  rows={2}
                                  defaultValue={"{{code ? code : ''}}"}
                                />
                              </div>
                            </div>
                          </>
                        )} */}
                      </div>
                    </div>
                  </div>
                  {isValidator && (
                    <div className="col-md-5">
                      <div className="mt-4">
                        <h4>Last Rounds</h4>
                      </div>
                      <div className="card" style={{ height: 'auto' }}>
                        <div className="card-body">
                          {rounds.length === 0 ? (
                            <div
                              style={{ minHeight: '95px' }}
                              className="d-flex justify-content-center"
                              ng-show="rounds.length == 0"
                            >
                              <div className="lds-ellipsis align-self-center">
                                <div />
                                <div />
                                <div />
                                <div />
                              </div>
                            </div>
                          ) : (
                            <div className="squares">
                              {rounds.length &&
                                rounds.map((round: any) => (
                                  <OverlayTrigger
                                    key={round.key}
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderRoundTooltip({ round })}
                                  >
                                    <div
                                      className={round.value ? 'full square-block' : 'square-block'}
                                    ></div>
                                  </OverlayTrigger>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {isValidator && (
                  <>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <h4>Proposed Blocks</h4>
                      </div>
                    </div>
                    <div className="row" ng-show="isValidator">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body">
                            Last 25 proposed blocks
                            <BlocksTable blocks={blocks} shardId={undefined} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="card">
                <div className="card-body card-details">
                  <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 text-center">
                      <div className="lds-ellipsis mx-auto">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                <span className="h4 empty-heading">Unable to load validators</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const renderRoundTooltip = (props: any) => {
  const { outOfBoundaries, ...style } = props;
  return (
    <div
      {...props}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '2px 10px',
        color: 'white',
        borderRadius: 3,
        ...style,
      }}
    >
      {props.round.key.indexOf('_') > 0 ? props.round.key.split('_').pop() : props.round.key}
    </div>
  );
};

const renderProgressTooltip = (props: any) => {
  const { outOfBoundaries, ...style } = props;
  return (
    <div
      {...props}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '2px 10px',
        color: 'white',
        borderRadius: 3,
        ...style,
      }}
    >
      {props.label}
    </div>
  );
};

export default ValidatorDetails;
