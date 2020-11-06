import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { IdentityType } from 'context/state';
import { adapter, Loader, DetailItem, Pager, PageState } from 'sharedComponents';
import { useParams } from 'react-router-dom';
import { NodesTable } from 'sharedComponents';
import { useFilters } from 'helpers';
import { ValidatorType } from 'context/validators';

const IdentityDetails = () => {
  const ref = React.useRef(null);
  const { id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [identity, setIdenity] = React.useState<IdentityType>();
  const [nodes, setNodes] = React.useState<any>();
  const [ratingOrder, setRatingOrder] = React.useState<string[]>([]);
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');
  const { getQueryObject, size } = useFilters();

  const fetchData = () => {
    const queryObject = getQueryObject();

    Promise.all([
      getIdentity(id),
      getNodes({ ...queryObject, identity: id, size }),
      getNodesCount({ ...queryObject, identity: id }),
    ]).then(([identityData, nodesData, nodesCount]) => {
      setIdenity(identityData.data);
      setNodes(nodesData.data);
      setTotalNodes(nodesCount.data);
      setDataReady(identityData.success && nodesData.success);
    });
  };

  React.useEffect(fetchData, []);

  const getRatings = () => {
    if (nodes) {
      const uniqueRatings = nodes
        .filter((node: ValidatorType) => node.nodeType === 'validator')
        .sort((a: any, b: any) => a.rating - b.rating)
        .map((v: any) => v.publicKey);
      setRatingOrder(uniqueRatings);
    }
  };
  React.useEffect(getRatings, [nodes]);

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
          <div className="row " data-testid="identityDetailsContainer">
            <div className="col-12 col-md-6 mb-spacer">
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
            <div className="col-12 col-md-6 mt-spacer mt-md-0 mb-spacer">
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
                      {identity.validators.toLocaleString('en')}
                    </DetailItem>

                    <DetailItem title="Score" colWidth="4">
                      {Math.floor(identity.score).toLocaleString()}
                    </DetailItem>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <>
                {nodes.length > 0 ? (
                  <>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-header-item">
                          <h6 className="m-0" data-testid="title">
                            Nodes
                          </h6>
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
                  </>
                ) : (
                  <PageState
                    icon={faCogs}
                    title="No Validators"
                    className="py-spacer my-auto"
                    dataTestId="errorScreen"
                  />
                )}
              </>
            </div>
          </div>
        </div>
      )}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to load validators"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
    </div>
  );
};

export default IdentityDetails;
