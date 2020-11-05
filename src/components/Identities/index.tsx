import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';
import { adapter, Loader } from 'sharedComponents';
import NodesLayout from 'sharedComponents/NodesLayout';
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
  const { getNodes } = adapter();
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
    <NodesLayout>
      <div ref={ref}>
        {success === undefined && <Loader />}
        {success === true && (
          <div className="branded-validators card-body card-list">
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
        )}
        {success === false && (
          <div className="card-body" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faCogs} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load validators</span>
            </div>
          </div>
        )}
      </div>
    </NodesLayout>
  );
};

export default Identities;
