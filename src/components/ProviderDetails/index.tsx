import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, Loader, Pager, PageState } from 'sharedComponents';
import { useParams } from 'react-router-dom';
import { NodesTable } from 'sharedComponents';
import { types, useFilters } from 'helpers';
import IdentityCard from 'components/IdentityDetails/IdentityCard';
import ProviderStats from './ProviderStats';

const ProviderDetails = () => {
  const ref = React.useRef(null);
  const { hash: address } = useParams() as any;
  const { getProvider, getNodes, getNodesCount } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(undefined);
  const [provider, setProvider] = React.useState<types.ProviderType>();
  const [nodes, setNodes] = React.useState<any>();
  const [totalNodes, setTotalNodes] = React.useState<number | '...'>('...');
  const { getQueryObject, size } = useFilters();

  const fetchData = () => {
    const queryObject = getQueryObject();

    Promise.all([
      getProvider(address),
      getNodes({ ...queryObject, provider: address, size }),
      getNodesCount({ ...queryObject, provider: address }),
    ]).then(([providerData, nodesData, nodesCount]) => {
      if (ref.current !== null) {
        // setProvider(providerData.data);
        setNodes(nodesData.data);
        setTotalNodes(nodesCount.data);
        // setDataReady(providerData.success && nodesData.success);

        setProvider({
          contract: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
          serviceFee: '12',
          withDelegationCap: true,
          maxDelegationCap: '100',
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
        });

        setDataReady(true && nodesData.success);
      }
    });
  };

  React.useEffect(fetchData, []);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCode}
          title="Unable to load provider details"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && (
          <div className="container pt-spacer">
            {provider && provider.identity !== undefined && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <IdentityCard identity={provider.identity} summary={true} />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12 mb-spacer">
                <ProviderStats provider={provider} />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-item d-flex align-items-center">
                      <h6 className="m-0" data-testid="title">
                        Nodes
                      </h6>

                      <Pager
                        className="ml-auto"
                        itemsPerPage={25}
                        page={String(size)}
                        total={totalNodes}
                        show
                      />
                    </div>
                  </div>

                  <div className="card-body p-0">
                    <NodesTable>
                      <NodesTable.Body nodes={nodes} />
                    </NodesTable>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <Pager
                      className="my-3"
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

export default ProviderDetails;
