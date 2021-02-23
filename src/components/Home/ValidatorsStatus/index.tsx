import * as React from 'react';
import { useGlobalState } from 'context';
import SimpleMap from './SimpleMap';
import { getMarkers, getLeaders, MarkerType, LeaderType } from './helpers/asyncRequests';
import calcContinentRank, { RankType } from './helpers/calcContinentRank';

import axios from 'axios';

const ValidatorsStatus = () => {
  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const [leaders, setLeaders] = React.useState<LeaderType[]>([]);
  const [continentsRank, setContinentsRank] = React.useState<RankType[]>([]);
  const [totalNodes, setTotalNodes] = React.useState<string | number>('...');

  const {
    timeout,
    refresh: { timestamp },
    activeNetwork: { apiUrl },
  } = useGlobalState();

  const fetchMarkers = () => {
    // getMarkers({ timeout, apiUrl: apiUrl || '' }).then(({ data }) => {
    //   setMarkers(data);
    // });
    axios
      .get(`markers.json`, {
        timeout,
      })
      .then(({ data }) => {
        setMarkers(data);
        setContinentsRank(calcContinentRank(data));

        let totalNodes = 0;
        data.forEach((marker: MarkerType) => (totalNodes += marker.validators));
        setTotalNodes(totalNodes);
      });
    fetchLeaders();
  };
  React.useEffect(fetchMarkers, []);

  const fetchLeaders = () => {
    // getLeaders({ timeout, apiUrl: apiUrl || '' }).then((data) => {
    //   setLeaders(data);
    // });

    axios
      .get(`leaders.json`, {
        timeout,
      })
      .then(({ data }) => {
        setLeaders(data);
      });
  };
  React.useEffect(fetchLeaders, [timestamp, markers]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Validators Status</h6>
          {totalNodes}
        </div>
      </div>
      <div className="card-body bg-black p-0 overflow-hidden">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 pl-0 pr-0">
              {process.env.NODE_ENV !== 'test' && <SimpleMap markers={markers} leaders={leaders} />}
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        {continentsRank.map(({ continent, nodes, percentage }, i) => (
          <div
            key={i}
            className={`row py-2 ${i + 1 < continentsRank.length ? 'border-bottom' : ''}`}
          >
            <div className="col d-flex align-items-center">
              {i + 1}. {continent}
            </div>
            <div className="col d-flex align-items-center text-secondary justify-content-end">
              {`${nodes} node${nodes === 1 ? '' : 's'}`}
            </div>
            <div className="col d-flex align-items-center text-secondary justify-content-end">
              {percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidatorsStatus;
