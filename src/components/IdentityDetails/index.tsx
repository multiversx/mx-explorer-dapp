import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IdentityType } from 'context/state';
import { adapter, Loader, DetailItem } from 'sharedComponents';
import { useParams } from 'react-router-dom';
import { stake } from 'components/Identities/IdentityRow';

const IdentityDetails = () => {
  const ref = React.useRef(null);
  const { id } = useParams() as any;
  const { getIdentity } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [identity, setIdenity] = React.useState<IdentityType>();

  const fetchIdentities = () => {
    getIdentity(id).then(({ data, success }) => {
      setIdenity(data);
      setDataReady(success);
    });
  };

  React.useEffect(fetchIdentities, []);

  return (
    <div ref={ref}>
      {dataReady === undefined && <Loader />}
      {dataReady === true && identity && (
        <div className="container py-spacer">
          <div className="row page-header mb-spacer">
            <div className="col-12">
              <h3 className="page-title">
                <span data-testid="title">Validator Details</span>
              </h3>
            </div>
          </div>
          <div className="row" data-testid="brandDetailsContainer">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-item p-0">
                    <div className="brand-header-item">
                      <img
                        className={`mr-3 avatar rounded-circle shadow-sm ${
                          identity.avatar ? '' : 'gray'
                        }`}
                        src={identity.avatar ? identity.avatar : '/validators/default-avatar.svg'}
                        alt={identity.name}
                        height="42"
                      />

                      {identity.name ? identity.name : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="container-fluid">
                    <DetailItem title="Location" colWidth="3">
                      {identity.location ? (
                        identity.location
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </DetailItem>

                    <DetailItem title="Twitter" colWidth="3">
                      {identity.twitter ? (
                        <a target={`_blank`} href={identity.twitter}>
                          {identity.twitter.split('/').pop()}
                        </a>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </DetailItem>

                    <DetailItem title="Web" colWidth="3">
                      {identity.website ? (
                        <a target={`_blank`} href={identity.website}>
                          {identity.website}
                        </a>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </DetailItem>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mt-spacer mt-md-0">
              <div className="card">
                <div className="card-body p-0">
                  <div className="container-fluid">
                    <DetailItem title="Stake" colWidth="4">
                      {identity.stake.toLocaleString('en')}
                    </DetailItem>

                    <DetailItem title="Stake percent" colWidth="4">
                      {identity.stakePercent}
                    </DetailItem>

                    <DetailItem title="Nodes" colWidth="4">
                      {identity.nodes.toLocaleString('en')}
                    </DetailItem>

                    <DetailItem title="Score" colWidth="4">
                      {Math.floor(identity.score).toLocaleString()}
                    </DetailItem>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {dataReady === false && (
        <div className="card-body" data-testid="errorScreen">
          <div className="empty">
            <FontAwesomeIcon icon={faCogs} className="empty-icon" />
            <span className="h4 empty-heading">Unable to load validators</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityDetails;
