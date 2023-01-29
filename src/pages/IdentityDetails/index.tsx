import React from 'react';
import { faCity } from '@fortawesome/pro-regular-svg-icons/faCity';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  useAdapter,
  Loader,
  Pager,
  PageState,
  ProvidersTable
} from 'components';
import { NodesTable, SharedIdentity } from 'components';
import { useGetFilters } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { IdentityType, NodeType, ProviderType } from 'types';

export const IdentityDetails = () => {
  const ref = React.useRef(null);
  const { hash: id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount, getProviders } = useAdapter();
  const { getQueryObject, size } = useGetFilters();
  const { walletAddress } = useSelector(activeNetworkSelector);

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(
    undefined
  );
  const [identity, setIdentity] = React.useState<IdentityType>();
  const [providers, setProviders] = React.useState<ProviderType[]>();
  const [providersFetched, setProvidersFetched] = React.useState<
    boolean | undefined
  >(undefined);
  const [nodes, setNodes] = React.useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');

  const fetchData = () => {
    const queryObject = getQueryObject();

    Promise.all([
      getIdentity(id),
      getProviders({ identity: id }),
      getNodes({ ...queryObject, identity: id, size }),
      getNodesCount({ ...queryObject, identity: id })
    ]).then(([identityData, providersData, nodesData, nodesCount]) => {
      if (ref.current !== null) {
        setIdentity(identityData.data);
        setProviders(providersData.data);
        setProvidersFetched(providersData.success);
        setNodes(nodesData.data);
        setTotalNodes(nodesCount.data);
        setDataReady(identityData.success && nodesData.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchData, []);

  const showProviders =
    providersFetched === false ||
    (providersFetched && providers !== undefined && providers.length > 0);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCity}
          title='Unable to load identity details'
          className='py-spacer my-auto'
          dataTestId='errorScreen'
        />
      )}
      <div ref={ref}>
        {dataReady === true && identity && (
          <div className='container page-content'>
            <div className='row' data-testid='identityDetailsContainer'>
              <div className='col-12 mb-3'>
                <SharedIdentity.Card identity={identity} />
              </div>
            </div>

            {showProviders && (
              <div className='row'>
                <div className='col-12 mb-3'>
                  <div className='card'>
                    {providersFetched === false ? (
                      <PageState
                        icon={faCode}
                        title='Unable to load providers'
                        className='py-spacer my-auto'
                        dataTestId='errorScreen'
                      />
                    ) : (
                      <>
                        <div className='card-header'>
                          <div className='card-header-item d-flex align-items-center'>
                            <h5 className='mb-0 d-flex align-items-center'>
                              Delegation Contracts
                            </h5>
                          </div>
                        </div>

                        <div className='card-body'>
                          {providers && (
                            <ProvidersTable
                              providers={providers}
                              showIdentity={false}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                      <h5
                        className='table-title d-flex align-items-center'
                        data-testid='title'
                      >
                        Nodes
                      </h5>
                      <Pager
                        itemsPerPage={25}
                        page={String(size)}
                        total={totalNodes}
                        className='d-flex ms-auto me-auto me-sm-0'
                        show
                      />
                    </div>
                  </div>

                  <div className='card-body'>
                    <NodesTable>
                      <NodesTable.Body nodes={nodes} />
                    </NodesTable>
                  </div>
                  <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                    <Pager
                      itemsPerPage={25}
                      page={String(size)}
                      total={totalNodes}
                      show
                    />
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
