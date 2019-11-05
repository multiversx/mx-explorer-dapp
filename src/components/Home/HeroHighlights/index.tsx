import * as React from 'react';
import Highlights from './../../../sharedComponents/Highlights';

const HeroHighlights: React.FC = () => {
  return (
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col-lg-5 mt-4 mb-4">
            <Highlights hero />
          </div>
          <div className="col-lg-7 mt-4 mb-4">
            <span className="highlight-label d-block text-center mt-4 mb-3">
              LIVE TPS • LAST 3 MIN
            </span>
            <div className="canvas">
              <canvas id="mycanvas" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3">
            <form
              className="form-search"
              ng-controller="processRequestCtrl"
              ng-submit="processRequest()"
              name="search_form"
              role="search"
            >
              <div className="input-group input-group-seamless">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Address / Txn Hash / Block Hash"
                  name="requestType"
                  required
                  ng-model="hashRequest"
                />
                <div className="input-group-append">
                  <button type="submit" className="input-group-text">
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHighlights;
