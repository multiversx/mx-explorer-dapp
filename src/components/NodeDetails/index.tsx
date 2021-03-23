import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, PageState, SharedIdentity } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
import NodeInformation from './NodeInformation';
import NetworkMetrics from './NetworkMetrics';
import Rounds, { RoundType } from './Rounds';
import { useIsMainnet } from 'helpers';
import BlocksTable, { BlockType } from 'sharedComponents/BlocksTable';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';

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
  const { getNode, getIdentity, getRounds, getBlocks } = adapter();
  const isMainnet = useIsMainnet();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>(true);
  const [node, setNode] = React.useState<NodeDetailType<NodeType>>(initialState);
  const [identity, setIdentity] = React.useState<NodeDetailType<IdentityType>>(initialState);
  const [rounds, setRounds] = React.useState<NodeDetailType<RoundType[]>>(initialState);
  const [blocks, setBlocks] = React.useState<NodeDetailType<BlockType[]>>(initialState);

  const fetchNodes = () => {
    setDataReady(undefined);
    getNode(publicKey).then((nodeData) => {
      if (nodeData.success) {
        const fetchIdentity = isMainnet && nodeData.data.identity !== undefined;

        if (nodeData.data.type !== 'observer') {
          const promises = [
            getRounds(publicKey),
            getBlocks({ proposer: publicKey }),
            ...(fetchIdentity ? [getIdentity(nodeData.data.identity)] : []),
          ];
          Promise.all(promises).then((response) => {
            const [roundsData, blocksData, identityData] = response;
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

              setDataReady(nodeData.success);
            }
          });
        } else {
          if (isMainnet && nodeData.data.identity !== undefined) {
            getIdentity(nodeData.data.identity).then((identityData) => {
              if (isMainnet && identityData) {
                setIdentity(identityData);
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
          <div className="container pt-spacer">
            {showIdentity && (
              <div className="row">
                <div className="col mb-spacer">
                  <SharedIdentity.Summary identity={identity.data} />
                </div>
              </div>
            )}

            <div className="row">
              <div className="mb-spacer col">
                <NodeInformation nodeData={node.data} />
              </div>
            </div>

            {node.data.type !== 'observer' && (
              <div className="row">
                <div className="mb-spacer col-md-6">
                  <NetworkMetrics node={node.data} />
                </div>
                <div className="col-md-6 mb-spacer">
                  <Rounds rounds={rounds} node={node.data} />
                </div>
              </div>
            )}

            {node.data.type === 'validator' && (
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    {blocks.success === false && <FailedBlocks />}
                    {blocks.success && blocks.data && (
                      <>
                        {blocks.data.length === 0 && (
                          <NoBlocks
                            title={`${
                              node.data.status === 'eligible'
                                ? 'No blocks'
                                : 'Validator not in consensus'
                            }`}
                          />
                        )}
                        {blocks.data.length > 0 && (
                          <>
                            <div className="card-header">
                              <div className="card-header-item">
                                <h6 className="m-0">Latest Proposed Blocks</h6>
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
        )}
      </div>
    </>
  );
};

export default NodeDetails;
