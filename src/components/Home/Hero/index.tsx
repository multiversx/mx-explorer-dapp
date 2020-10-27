import * as React from 'react';
import { useGlobalState } from 'context';
import Leaflet from './Leaflet';

const Hero = () => {
  const { activeNetwork } = useGlobalState();
  const isMainnet = activeNetwork.name.toLowerCase() === 'mainnet';
  return isMainnet ? (
    <div className="bg-black">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 pl-0 pr-0">
            <div className="canvas" style={{ height: '450px' }}>
              {process.env.NODE_ENV !== 'test' && <Leaflet />}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Hero;
