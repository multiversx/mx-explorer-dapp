import React, { useEffect, useRef, useState } from 'react';
import { faCity, faCode } from '@fortawesome/pro-regular-svg-icons';
import { useParams, useLocation } from 'react-router-dom';

import { Loader, Pager, PageState, ProvidersTable } from 'components';
import { NodesTable, SharedIdentity } from 'components';
import { useAdapter, useGetNodeFilters, useGetPage, useGetSearch } from 'hooks';
import { IdentityType, NodeType, ProviderType } from 'types';

export const IdentityDetails = () => {
  const ref = useRef(null);
  const { hash: id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount, getProviders } = useAdapter();

  const { search: searchLocation } = useLocation();
  const nodeFilters = useGetNodeFilters();
  const { page } = useGetPage();
  const { search } = useGetSearch();

  const [dataReady, setDataReady] = useState<boolean | undefined>(undefined);
  const [identity, setIdentity] = useState<IdentityType>();
  const [providers, setProviders] = useState<ProviderType[]>();
  const [providersFetched, setProvidersFetched] = useState<boolean | undefined>(
    undefined
  );
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');

  const fetchData = () => {
    Promise.all([
      getIdentity(id),
      getProviders({ identity: id }),
      getNodes({ ...nodeFilters, search, identity: id, page }),
      getNodesCount({ ...nodeFilters, search, identity: id })
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

  useEffect(fetchData, [searchLocation]);

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
                    <Pager total={totalNodes} show />
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
