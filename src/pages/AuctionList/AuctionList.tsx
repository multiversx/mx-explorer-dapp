import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  NodeStatus,
  NetworkLink,
  Trim,
  Overlay,
  Denominate,
  Loader,
  Pager,
  PageState,
  NodesTableHero,
  NodeIcon,
  NodeFullHistoryIcon,
  NodeIssueIcon,
  NodeLockedStakeTooltip,
  SharedIdentity
} from 'components';
import { urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetNodeFilters,
  useGetPage,
  useGetSearch,
  useGetSort
} from 'hooks';
import { faCogs } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { validatorsRoutes } from 'routes';
import { NodeType, IdentityType } from 'types';

export const AuctionList = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { getNodes, getNodesCount, getIdentities } = useAdapter();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const nodeFilters = useGetNodeFilters();
  const sort = useGetSort();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [identities, setIdentities] = useState<IdentityType[]>([]);
  const [totalNodes, setTotalNodes] = useState<number | '...'>('...');
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const { type, status } = Object.fromEntries(searchParams);

  const fetchNodes = () => {
    setDataReady(undefined);

    Promise.all([
      getIdentities(),
      getNodes({ ...nodeFilters, ...sort, search, page, size }),
      getNodesCount({ ...nodeFilters, search })
    ]).then(([identitiesData, nodesData, count]) => {
      setIdentities(identitiesData.data);
      setNodes(nodesData.data);
      setTotalNodes(count.data);

      if (ref.current !== null) {
        setDataReady(identitiesData.data && nodesData.success && count.success);
      }
    });
  };

  useEffect(fetchNodes, [searchParams]);

  return (
    <div className='card auction-list' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <NodesTableHero />
        </div>
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState icon={faCogs} title='Unable to load Nodes' isError />
      )}

      {dataReady === true && (
        <>
          <div className='card-body'>
            <table className='table auction-list-table mb-0'>
              <thead>
                <tr>
                  <th className='th-rank'>#</th>
                  <th className='th-eligibility'>Eligibility</th>
                  <th className='th-identity'>Validator</th>
                  <th className='th-name'>Name</th>
                  <th className='th-key'>Key</th>
                  <th className='th-stake'>Stake / Node</th>
                  <th className='th-treshold'>Until Treshold</th>
                  <th className='th-info'></th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node, i) => {
                  const nodeIdentity = identities.find(
                    (identity) => identity.identity === node.identity
                  );

                  const nodeIdentityLink = node.identity
                    ? urlBuilder.identityDetails(node.identity)
                    : urlBuilder.nodeDetails(node.name);

                  return (
                    <tr key={node.bls}>
                      <td>{i + 1}</td>
                      <td>
                        <NodeStatus node={node} />
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          {nodeIdentity && (
                            <div className='me-3'>
                              <NetworkLink to={nodeIdentityLink}>
                                <SharedIdentity.Avatar
                                  identity={nodeIdentity}
                                />
                              </NetworkLink>
                            </div>
                          )}
                          {nodeIdentity?.name &&
                          nodeIdentity.name.length > 70 ? (
                            <NetworkLink
                              to={nodeIdentityLink}
                              className='trim-wrapper trim-size-xl'
                            >
                              <Trim text={nodeIdentity?.name} />
                            </NetworkLink>
                          ) : (
                            <NetworkLink
                              to={nodeIdentityLink}
                              className='trim-wrapper trim-size-xl'
                            >
                              {nodeIdentity?.name ?? 'N/A'}
                            </NetworkLink>
                          )}
                        </div>
                      </td>
                      <td>
                        {node.name ? (
                          <div className='truncate-item-lg'>{node.name}</div>
                        ) : (
                          <span className='text-neutral-400'>N/A</span>
                        )}
                      </td>
                      <td>
                        <div className='d-flex align-items-center hash'>
                          <NodeIcon node={node} />
                          <NodeFullHistoryIcon node={node} />
                          <NetworkLink
                            to={urlBuilder.nodeDetails(node.bls)}
                            className='trim-wrapper'
                          >
                            <Trim text={node.bls} />
                          </NetworkLink>
                          <NodeIssueIcon node={node} />
                        </div>
                      </td>
                      <td>
                        <Overlay title={<NodeLockedStakeTooltip node={node} />}>
                          <Denominate value={node.locked} showTooltip={false} />
                        </Overlay>
                      </td>
                      <td>{i + 1}</td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
            <Pager total={totalNodes} show />
          </div>
        </>
      )}
    </div>
  );
};
