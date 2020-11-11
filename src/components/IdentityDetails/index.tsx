import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { IdentityType } from 'context/state';
import { adapter, Loader, DetailItem, Pager, PageState } from 'sharedComponents';
import { useParams } from 'react-router-dom';
import { NodesTable } from 'sharedComponents';
import { useFilters } from 'helpers';
import { useGlobalState } from 'context';

const IdentityDetails = () => {
  const ref = React.useRef(null);
  const { id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [identity, setIdentity] = React.useState<IdentityType>();
  const [nodes, setNodes] = React.useState<any>();
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');
  const { getQueryObject, size } = useFilters();
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const fetchData = () => {
    const queryObject = getQueryObject();

    Promise.all([
      getIdentity(id),
      getNodes({ ...queryObject, identity: id, size }),
      getNodesCount({ ...queryObject, identity: id }),
    ]).then(([identityData, nodesData, nodesCount]) => {
      setIdentity(identityData.data);
      setNodes(nodesData.data);
      setTotalNodes(nodesCount.data);
      setDataReady(identityData.success && nodesData.success);
    });
  };

  React.useEffect(fetchData, []);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to load identity details"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && identity && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Validator Details</span>
                </h3>
              </div>
            </div>
            <div className="row " data-testid="identityDetailsContainer">
              <div className="col-12 col-md-6 mb-spacer">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item p-0">
                      <div className="identity-header-item px-lg-spacer justify-content-center">
                        <img
                          className={`identity-avatar rounded-circle mr-2 ${
                            !identity.avatar ? 'p-1 bg-light' : ''
                          }`}
                          src={
                            identity.avatar
                              ? identity.avatar
                              : require('../../assets/images/default-avatar.svg')
                          }
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
                          <span className="text-secondary">N/A</span>
                        )}
                      </DetailItem>

                      <DetailItem title="Twitter" colWidth="3">
                        {identity.twitter ? (
                          <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.twitter}>
                            {identity.twitter.split('/').pop()}
                          </a>
                        ) : (
                          <span className="text-secondary">N/A</span>
                        )}
                      </DetailItem>

                      <DetailItem title="Web" colWidth="3">
                        {identity.website ? (
                          <a target={`_blank`} rel={`noreferrer nofollow`} href={identity.website}>
                            {identity.website}
                          </a>
                        ) : (
                          <span className="text-secondary">N/A</span>
                        )}
                      </DetailItem>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-spacer">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Stake" colWidth="4">
                        {identity.stake.toLocaleString('en')} {erdLabel}
                      </DetailItem>

                      <DetailItem title="Stake percent" colWidth="4">
                        {Math.round(identity.stakePercent) > 0
                          ? Math.round(identity.stakePercent)
                          : '< 1'}
                        %
                      </DetailItem>

                      <DetailItem title="Nodes" colWidth="4">
                        {identity.validators.toLocaleString('en')}
                      </DetailItem>

                      <DetailItem title="Score" colWidth="4">
                        {Math.floor(identity.score).toLocaleString('en')}
                      </DetailItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item">
                      <h6 className="m-0" data-testid="title">
                        Nodes
                      </h6>
                    </div>
                  </div>

                  <div className="card-body p-0">
                    <NodesTable>
                      <NodesTable.Body nodes={nodes} />
                    </NodesTable>
                  </div>
                  <div className="card-footer">
                    <Pager itemsPerPage={25} page={String(size)} total={totalNodes} show />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IdentityDetails;
