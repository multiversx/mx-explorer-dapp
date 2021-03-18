import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { IdentityType } from 'context/state';
import { adapter, Loader, Pager, PageState, ProvidersTable } from 'sharedComponents';
import { useParams } from 'react-router-dom';
import { NodesTable, SharedIdentity } from 'sharedComponents';
import { useFilters, types } from 'helpers';

const IdentityDetails = () => {
  const ref = React.useRef(null);
  const { id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount, getProviders } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [identity, setIdentity] = React.useState<IdentityType>();
  const [providers, setProviders] = React.useState<types.ProviderType[]>();
  const [providersFetched, setProvidersFetched] = React.useState<boolean | undefined>(undefined);
  const [nodes, setNodes] = React.useState<any>();
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');
  const { getQueryObject, size } = useFilters();

  const fetchData = () => {
    const queryObject = getQueryObject();

    Promise.all([
      getIdentity(id),
      getProviders({
        identity: id,
      }),
      getNodes({ ...queryObject, identity: id, size }),
      getNodesCount({ ...queryObject, identity: id }),
    ]).then(([identityData, providersData, nodesData, nodesCount]) => {
      setIdentity(identityData.data);

      // setProvidersFetched(providersData.success);
      // setProviders(providersData.data);

      setProviders([
        {
          contract: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
          serviceFee: '12',
          maxDelegationCap: '12321',
          apr: '29',
          totalActiveStake: '2250000000000000000000000',
          numUsers: 4,
          numNodes: 20,
          identity: {
            name: 'Just Mining',
            avatar:
              'https://s3.amazonaws.com/keybase_processed_uploads/b011b27c59f42344b38b476da9d85105_360_360.jpg',
            identity: 'thomasjustmining',
            website: 'https://elrond.com',
            validators: 1454,
            score: 174480,
            stake: 3635000,
            stakePercent: 67.04,
          },
        },
        {
          contract: 'erd195fe57d7fm5h33585sc7wl8trqhrmy85z3dg6f6mqd0724ymljxq3zjemc',
          serviceFee: '5',
          maxDelegationCap: '12321',
          apr: '34',
          totalActiveStake: '1250000000000000000000000',
          numUsers: 1,
          numNodes: 1,
          identity: {
            avatar:
              'https://s3.amazonaws.com/keybase_processed_uploads/b011b27c59f42344b38b476da9d85105_360_360.jpg',
            identity: 'thomasjustmining',
            website: 'https://elrond.com',
            name: 'Just Mining',
            validators: 1454,
            score: 174480,
            stake: 3635000,
            stakePercent: 67.04,
          },
        },
      ]);
      setProvidersFetched(true);
      setNodes(nodesData.data);
      setTotalNodes(nodesCount.data);
      setDataReady(identityData.success && nodesData.success);
    });
  };

  React.useEffect(fetchData, []);

  const showProviders = providersFetched === false || (providersFetched && providers);
  const website = identity && identity.website ? identity.website : 'https://wallet.elrond.com';

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
            <div className="row" data-testid="identityDetailsContainer">
              <div className="col-12 mb-spacer">
                <SharedIdentity.Card identity={identity} />
              </div>
            </div>

            {showProviders && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <div className="card">
                    {providersFetched === false ? (
                      <PageState
                        icon={faCode}
                        title="Unable to load providers"
                        className="py-spacer my-auto"
                        dataTestId="errorScreen"
                      />
                    ) : (
                      <>
                        <div className="card-header">
                          <div className="card-header-item d-flex align-items-center">
                            <h6 className="m-0">Delegation Contracts</h6>

                            <div className="ml-auto">
                              <a
                                className="btn btn-sm btn-primary-light"
                                target={`_blank`}
                                rel={`noreferrer nofollow`}
                                href={website}
                              >
                                Stake now
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="card-body p-0">
                          {providers && (
                            <ProvidersTable providers={providers} showIdentity={false} />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                  <div className="card-footer d-flex justify-content-end">
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
