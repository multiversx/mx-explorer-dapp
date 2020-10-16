import React from 'react';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';
import { adapter, Loader, NodesTabs } from 'sharedComponents';
import IdentityRow from './IdentityRow';

const initialState = [
  {
    name: 'Viastake',
    avatar: '',
    identity: 'viastake',
    score: 1,
    stake: 1900,
    twitter: 'Sample',
    web: 'Sample',
    location: 'Sample',
    stakePercent: 15,
    overallStakePercent: 20,
    nodesCount: 1,
  },
];

const Identities = () => {
  const ref = React.useRef(null);
  const { getNodes, getNetworkConfig } = adapter();
  const [success, setSuccess] = React.useState<boolean | undefined>(undefined);
  const dispatch = useGlobalDispatch();
  const { brands } = useGlobalState();

  const fetchBrands = () => {
    setTimeout(() => {
      dispatch({
        type: 'setBrands',
        brands: initialState,
      });
      setSuccess(true);
    }, 500);
  };

  React.useEffect(fetchBrands, []);

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>
              <span data-testid="title">Nodes</span>
            </h4>
          </div>
        </div>
        {success === undefined && <Loader />}
        {success === true && (
          <div className="branded-validators row mb-3" ref={ref}>
            <div className="col-12">
              <div className="card">
                <div className="card-body card-list">
                  <NodesTabs />
                  <div className="table-responsive" style={{ minHeight: '50px' }}>
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th className="th-rank">#</th>
                          <th className="th-name">Validator Name</th>
                          <th>Stake</th>
                          <th className="th-stake-percent">Cumulative stake</th>
                          <th className="w-10 text-right">Nodes</th>
                          <th className="w-10 text-right">Score</th>
                          <th className="th-details">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brands.map((brand, i) => {
                          return <IdentityRow key={i} rank={i + 1} brand={brand} />;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {success === false && (
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

export default Identities;
