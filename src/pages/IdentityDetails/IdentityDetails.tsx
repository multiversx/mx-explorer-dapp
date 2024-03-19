import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, Pager, PageState, ProvidersTable } from 'components';
import { NodesFilters, NodesTable, SharedIdentity } from 'components';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCity, faCode } from 'icons/regular';
import { IdentityType, NodeType, ProviderType } from 'types';

export const IdentityDetails = () => {
  const ref = useRef(null);
  const { hash: id } = useParams() as any;
  const { getIdentity, getNodes, getNodesCount, getProviders } = useAdapter();

  const [searchParams] = useSearchParams();
  const nodeFilters = useGetNodeFilters();
  const { page, size } = useGetPage();
  const { sort, order } = useGetSort();
  const { search } = useGetSearch();
  const { type, status } = nodeFilters;

  const [dataReady, setDataReady] = useState<boolean | undefined>(undefined);
  const [identity, setIdentity] = useState<IdentityType>();
  const [providers, setProviders] = useState<ProviderType[]>();
  const [providersFetched, setProvidersFetched] = useState<boolean | undefined>(
    undefined
  );
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');

  const fetchData = () => {
    Promise.all([getIdentity(id), getProviders({ identity: id })]).then(
      ([identityData, providersData]) => {
        if (ref.current !== null) {
          setIdentity(identityData.data);
          setProviders(providersData.data);
          setProvidersFetched(providersData.success);
          setDataReady(identityData.success);
        }
      }
    );
  };

  const fetchNodes = () => {
    Promise.all([
      getNodes({
        ...nodeFilters,
        search,
        identity: id,
        page,
        size,
        sort,
        order
      }),
      getNodesCount({ ...nodeFilters, search, identity: id, sort, order })
    ]).then(([nodesData, nodesCount]) => {
      if (ref.current !== null) {
        setNodes(nodesData.data);
        setTotalNodes(nodesCount.data);
      }
    });
  };

  useEffect(fetchData, []);
  useEffect(fetchNodes, [searchParams]);

  const showProviders =
    providersFetched === false ||
    (providersFetched && providers !== undefined && providers.length > 0);

  return (
    <div ref={ref}>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCity}
          title='Unable to load identity details'
          isError
        />
      )}
      {dataReady === true && identity && (
        <>
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
                      isError
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
                    <NodesFilters />
                    <Pager
                      total={totalNodes}
                      className='d-flex ms-auto me-auto me-sm-0'
                      showFirstAndLast={false}
                      show
                    />
                  </div>
                </div>

                <div className='card-body'>
                  <NodesTable
                    type={type as NodeType['type']}
                    status={status as NodeType['status']}
                  >
                    <NodesTable.Body
                      nodes={nodes}
                      type={type as NodeType['type']}
                      status={status as NodeType['status']}
                    />
                  </NodesTable>
                </div>
                <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                  <Pager total={totalNodes} show />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
