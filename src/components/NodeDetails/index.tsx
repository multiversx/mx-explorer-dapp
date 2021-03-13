import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, LatestBlocks, Loader, PageState, SharedIdentity } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
import NodeInformation from './NodeInformation';
import NetworkMetrics from './NetworkMetrics';
import Rounds, { RoundType } from './Rounds';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';
import { BlockType } from 'sharedComponents/BlocksTable';
import { useIsMainnet } from 'helpers';

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

        if (nodeData.data.nodeType !== 'observer') {
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
          const promises = [...(fetchIdentity ? [getIdentity(nodeData.data.identity)] : [])];

          if (promises.length > 0) {
            Promise.all(promises).then((response) => {
              const [identityData] = response;
              if (ref.current !== null) {
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
          <>
            <div className="container pt-spacer">
              <div className="row">
                <div className="mb-spacer col">
                  <NodeInformation node={node.data} />
                </div>
              </div>

              {showIdentity && (
                <div className="row">
                  <div className="col mb-spacer">
                    <SharedIdentity.Summary identity={identity.data} />
                  </div>
                </div>
              )}

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
                    {blocks.success && blocks.data && blocks.data.length > 0 ? (
                      <LatestBlocks proposer={publicKey} />
                    ) : (
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
                          </>
                        )}
                      </div>
                    )}
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
