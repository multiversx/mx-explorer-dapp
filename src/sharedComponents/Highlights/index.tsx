import React from 'react';
import { useGlobalState } from '../../context';
import { getStats } from './helpers/asyncRequests';
import DefaultHighlights from './DefaultHighlights';
import HeroHighlights from './HeroHighlights';

export type StateType = {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
};

const initialState = {
  blockNumber: '...',
  nrOfNodes: '...',
  nrOfShards: '...',
  roundNumber: '...',
  liveTPS: '...',
  peakTPS: '...',
  totalProcessedTxCount: '...',
};

const Hightlights = ({ hero = false }: { hero?: boolean }) => {
  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();
  const [state, setState] = React.useState<StateType>(initialState);
  let ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current !== null) {
      getStats(elasticUrl).then(({ data, success }) => {
        const newState = success
          ? {
              blockNumber: parseInt(data.blockNumber).toLocaleString('en'),
              nrOfNodes: parseInt(data.nrOfNodes).toLocaleString('en'),
              nrOfShards: parseInt(data.nrOfShards).toLocaleString('en'),
              roundNumber: parseInt(data.roundNumber).toLocaleString('en'),
              liveTPS: parseInt(data.liveTPS).toLocaleString('en'),
              peakTPS: parseInt(data.peakTPS).toLocaleString('en'),
              totalProcessedTxCount: parseInt(data.totalProcessedTxCount).toLocaleString('en'),
            }
          : initialState;

        setState(newState);
      });
    }
  }, [elasticUrl]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>{!hero ? <DefaultHighlights {...state} /> : <HeroHighlights {...state} />}</div>
  );
};

export default Hightlights;
