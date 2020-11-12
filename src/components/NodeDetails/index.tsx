import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { adapter, BlocksTable, Loader, PageState } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
import Alert from './Alert';
import NodeInformation from './NodeInformation';
import Identity from './Identity';
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
        const promises = [
          getRounds({
            validator: publicKey,
          }),
          getBlocks({ proposer: publicKey }),
          ...(isMainnet ? [getIdentity(nodeData.data.identity)] : []),
        ];
        Promise.all(promises).then((response) => {
          const [roundsData, blocksData, identityData] = response;
          if (ref.current !== null) {
            setNode(nodeData);

            setBlocks({
              data: (blocksData as any).blocks,
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
            if (isMainnet) {
              setIdentity(identityData);
            }

            setDataReady(nodeData.success);
          }
        });
      } else {
        setDataReady(false);
      }
    });
  };

  React.useEffect(fetchNodes, [search]);

  const showIdentityCard =
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
              <div className="row page-header">
                <div className="col-12">
                  <h3 className="page-title mb-4" data-testid="title">
                    Node Information
                  </h3>
                </div>
              </div>
              <Alert node={node.data} />
              <div className="row">
                <div className={`mb-spacer ${showIdentityCard ? 'col-md-8' : 'col-12'}`}>
                  <NodeInformation node={node.data} colWidth={showIdentityCard ? '3' : '2'} />
                </div>
                {showIdentityCard && (
                  <div className="col-md-4 mb-spacer">
                    <Identity identity={identity.data} />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="mb-spacer col-md-6">
                  <NetworkMetrics node={node.data} />
                </div>
                <div className="col-md-6 mb-spacer">
                  <Rounds rounds={rounds} node={node.data} />
                </div>
              </div>
              {node.data.nodeType === 'validator' && (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      {blocks.success === false && (
                        <>
                          {node.data.peerType === 'waiting' ? (
                            <PageState
                              icon={faCube}
                              title="Validator not in consensus"
                              className="py-spacer my-auto"
                              dataTestId="notInConsensusErrorScreen"
                            />
                          ) : (
                            <FailedBlocks />
                          )}
                        </>
                      )}

                      {blocks.success && blocks.data && (
                        <>
                          {blocks.data.length === 0 && (
                            <NoBlocks
                              title={
                                node.data.peerType === 'waiting'
                                  ? 'Validator not in consensus'
                                  : 'No blocks'
                              }
                            />
                          )}
                          {blocks.data.length > 0 && (
                            <>
                              <div className="card-header">
                                <div className="card-header-item">
                                  <h6 className="m-0">Last proposed Blocks</h6>
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
