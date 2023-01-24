import * as React from 'react';

import { useSelector } from 'react-redux';
import { TIMEOUT } from 'appConstants';
import { useAdapter } from 'components';
import { activeNetworkSelector } from 'redux/selectors';
import { getMarkers, MarkerType } from './helpers/asyncRequests';
import { calcContinentRank, RankType } from './helpers/calcContinentRank';

import { SimpleMap } from './SimpleMap';

const placeHolderRank = [
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  },
  {
    continent: '...',
    nodes: 0,
    percentage: 0
  }
];

export const ValidatorsStatus = () => {
  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const [continentsRank, setContinentsRank] =
    React.useState<RankType[]>(placeHolderRank);
  const [totalNodes, setTotalNodes] = React.useState<string | number>('...');
  const [queuedNodes, setQueuedNodes] = React.useState<string | number>('...');
  const ref = React.useRef(null);

  const { apiAddress } = useSelector(activeNetworkSelector);

  const { getShards, getGlobalStake } = useAdapter();

  const fetchMarkers = () => {
    Promise.all([
      getMarkers({ timeout: TIMEOUT, apiAddress: apiAddress || '' }),
      getShards(),
      getGlobalStake()
    ]).then(([markersData, shardData, globalStake]) => {
      if (ref.current !== null) {
        if (markersData.success && shardData.success) {
          let totalValidators = 0;
          shardData.data.forEach(
            (shard: any) => (totalValidators += shard.validators)
          );
          if (markersData.data.length > 0 && totalValidators > 0) {
            setMarkers(markersData.data);
            setTotalNodes(totalValidators);
            setContinentsRank(
              calcContinentRank(markersData.data, totalValidators)
            );
          }
          if (globalStake.success) {
            setQueuedNodes(globalStake.data.queueSize);
          }
        }
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMarkers, []);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <div className='card-header-item d-flex justify-content-between align-items-center'>
          <h6 className='m-0'>Validators Status</h6>
          <div>
            {totalNodes.toLocaleString('en')} Active /{' '}
            {queuedNodes.toLocaleString('en')} Queue
          </div>
        </div>
      </div>
      <div className='card-body bg-black p-0 overflow-hidden'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12 ps-0 pe-0'>
              {process.env.NODE_ENV !== 'test' && (
                <SimpleMap markers={markers} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='card-footer py-0'>
        <div className='container'>
          {continentsRank.map(({ continent, nodes, percentage }, i) => (
            <div
              key={i}
              className={`row py-2 ${
                i + 1 < continentsRank.length ? 'border-bottom' : ''
              }`}
            >
              <div className='col ps-0 d-flex align-items-center continent-name'>
                {i + 1}. {continent}
              </div>
              <div className='col d-flex align-items-center text-secondary justify-content-end'>
                {nodes > 0
                  ? `${nodes.toLocaleString('en')} node${
                      nodes === 1 ? '' : 's'
                    }`
                  : '...'}
              </div>
              <div className='col pe-0 d-flex align-items-center text-secondary justify-content-end'>
                {percentage > 0 ? `${percentage}%` : '...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
