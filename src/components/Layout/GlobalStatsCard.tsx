import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faLeaf } from '@fortawesome/pro-solid-svg-icons/faLeaf';
import { useGlobalState } from 'context';
import { useLocation } from 'react-router-dom';
import { validatorsRoutes } from 'routes';

const GlobalStatsCard = () => {
  const { globalStats } = useGlobalState();
  const activePath = useLocation().pathname;
  let show = true;

  switch (true) {
    case activePath === '/':
    case activePath.includes('/identities'):
    case activePath.includes(validatorsRoutes.index):
    case activePath.includes(validatorsRoutes.nodes):
    case activePath.includes(validatorsRoutes.providers):
      show = false;
      break;
  }

  return show ? (
    <div className="container global-stats-card">
      <div className="row">
        <div className="col mb-spacer">
          <div className="card d-flex flex-column flex-lg-row py-3 py-lg-spacer px-3 px-lg-spacer">
            <div className="d-flex align-items-center mb-3 mb-lg-0 pr-md-5">
              <div className="right-angle-icon lg mr-4">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div className="d-flex flex-column">
                <span className="text-secondary mb-1">Market Info</span>
                <span>{globalStats.usd}</span>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3 mb-lg-0 pr-md-5">
              <div className="right-angle-icon lg mr-4">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <div className="d-flex flex-column">
                <span className="text-secondary mb-1">Usage</span>
                <span>{globalStats.accounts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default GlobalStatsCard;
