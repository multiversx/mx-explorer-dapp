import * as React from 'react';
import Leaflet from './Leaflet';

const ValidatorsStatus = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Validators Status</h6>
          2169
        </div>
      </div>
      <div className="card-body bg-black p-0 overflow-hidden">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 pl-0 pr-0">
              <div className="canvas" style={{ height: '350px' }}>
                {process.env.NODE_ENV !== 'test' && <Leaflet />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between py-2 border-bottom">
          <span>1. Europe</span>
          <span>649 nodes</span>
          <span>45%</span>
        </div>

        <div className="d-flex justify-content-between py-2 border-bottom">
          <span>2. Europe</span>
          <span>649 nodes</span>
          <span>45%</span>
        </div>

        <div className="d-flex justify-content-between py-2 border-bottom">
          <span>3. Europe</span>
          <span>649 nodes</span>
          <span>45%</span>
        </div>

        <div className="d-flex justify-content-between py-2">
          <span>4. Europe</span>
          <span>649 nodes</span>
          <span>45%</span>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsStatus;
