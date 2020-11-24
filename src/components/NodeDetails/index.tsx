import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, BlocksTable, Loader, PageState } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
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
          getRounds(publicKey),
          getBlocks({ proposer: publicKey }),
          ...(isMainnet && nodeData.data.identity !== undefined
            ? [getIdentity(nodeData.data.identity)]
            : []),
        ];
        Promise.all(promises).then((response) => {
          const [roundsData, blocksData, identityData] = response;
          if (ref.current !== null) {
            setNode(nodeData);

            setBlocks({
              data: blocksData.data.blocks,
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
