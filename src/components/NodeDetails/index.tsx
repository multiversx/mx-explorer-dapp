import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, BlocksTable, Loader, PageState } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
import NodeInformation from './NodeInformation';
import NetworkMetrics from './NetworkMetrics';
import Rounds, { RoundType } from './Rounds';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';
import { BlockType } from 'sharedComponents/BlocksTable';
import { useIsMainnet, types } from 'helpers';
import IdentityCard from 'components/IdentityDetails/IdentityCard';
import ProviderStats from 'components/ProviderDetails/ProviderStats';

interface NodeDetailType<T> {
  data?: T;
  success: boolean | undefined;
}

const initialState = {
  success: undefined,
};

const NodeDetails = () => {
  const ref = React.useRef(null);
  const { publicKey } = useParams() as any;
  const { search } = useLocation();
  const { getNode, getIdentity, getRounds, getBlocks, getProvider } = adapter();
  const isMainnet = useIsMainnet();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(true);
  const [node, setNode] = React.useState<NodeDetailType<NodeType>>(initialState);
  const [identity, setIdentity] = React.useState<NodeDetailType<IdentityType>>(initialState);
  const [provider, setProvider] = React.useState<NodeDetailType<types.ProviderType>>(initialState);
  const [rounds, setRounds] = React.useState<NodeDetailType<RoundType[]>>(initialState);
  const [blocks, setBlocks] = React.useState<NodeDetailType<BlockType[]>>(initialState);

  const fetchNodes = () => {
    setDataReady(undefined);
    getNode(publicKey).then((nodeData) => {
      if (nodeData.success) {
        const fetchIdentity = isMainnet && nodeData.data.identity !== undefined;
        const fetchProvider = nodeData.data.owner !== undefined;

        if (nodeData.data.nodeType !== 'observer') {
          const promises = [
            getRounds(publicKey),
            getBlocks({ proposer: publicKey }),
            ...(fetchIdentity ? [getIdentity(nodeData.data.identity)] : []),
            ...(fetchProvider ? [getProvider(nodeData.data.owner)] : []),
          ];
          Promise.all(promises).then((response) => {
            const [roundsData, blocksData, identityData, providerData] = response;
            if (ref.current !== null) {
              setNode(nodeData);

              setBlocks({
                data: blocksData.success ? blocksData.data.blocks : [],
                success: blocksData.success,
              });

              setRounds({
                data: roundsData.success
                  ? (roundsData as any).data.map((round: any) => ({
                      key: round.round,
                      value: round.blockWasProposed,
                    }))
                  : [],
                success: roundsData.success,
              });

              if (isMainnet && identityData) {
                setIdentity(identityData);
              }

              // if (providerData) {
              //   setProvider(providerData);
              // }

              setProvider({
                data: {
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
                },
                success: true,
              });

              setDataReady(nodeData.success);
            }
          });
        } else {
          const promises = [
            ...(fetchIdentity ? [getIdentity(nodeData.data.identity)] : []),
            ...(fetchProvider ? [getProvider(nodeData.data.owner)] : []),
          ];

          if (promises.length > 0) {
            Promise.all(promises).then((response) => {
              const [identityData, providerData] = response;
              if (ref.current !== null) {
                setIdentity(identityData);
                setProvider(providerData);
                setNode(nodeData);
                setDataReady(true);
              }
            });
          } else {
            setNode(nodeData);
            setDataReady(true);
          }
        }
      } else {
        setDataReady(false);
      }
    });
  };

  React.useEffect(fetchNodes, [search]);

  const showIdentity =
    identity.success === false || (identity.success && identity.data !== undefined);

  const showProviderStats =
    provider.success === false || (provider.success && provider.data !== undefined);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to locate this node"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && node.data !== undefined && (
          <>
            <div className="container pt-spacer">
              {showIdentity && (
                <div className="row">
                  <div className="col mb-spacer">
                    <IdentityCard identity={identity.data} summary={true} />
                  </div>
                </div>
              )}

              {showProviderStats && (
                <div className="row">
                  <div className="col mb-spacer">
                    <ProviderStats provider={provider.data} />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="mb-spacer col">
                  <NodeInformation node={node.data} />
                </div>
              </div>

              {node.data.nodeType !== 'observer' && (
                <div className="row">
                  <div className="mb-spacer col-md-6">
                    <NetworkMetrics node={node.data} />
                  </div>
                  <div className="col-md-6 mb-spacer">
                    <Rounds rounds={rounds} node={node.data} />
                  </div>
                </div>
              )}

              {node.data.nodeType === 'validator' && (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      {blocks.success === false && <FailedBlocks />}
                      {blocks.success && blocks.data && (
                        <>
                          {blocks.data.length === 0 && (
                            <NoBlocks
                              title={`${
                                node.data.peerType === 'eligible'
                                  ? 'No blocks'
                                  : 'Validator not in consensus'
                              }`}
                            />
                          )}
                          {blocks.data.length > 0 && (
                            <>
                              <div className="card-header">
                                <div className="card-header-item">
                                  <h6 className="m-0">Latest proposed Blocks</h6>
                                </div>
                              </div>
                              <div className="card-body p-0">
                                <BlocksTable blocks={blocks.data} shard={undefined} />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NodeDetails;
