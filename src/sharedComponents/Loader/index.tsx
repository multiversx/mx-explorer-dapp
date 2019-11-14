import React from 'react';

const Loader = () => (
  <div className="card">
    <div className="card-body card-details">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-12 text-center">
          <div className="lds-ellipsis mx-auto mt-5 mb-5">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
