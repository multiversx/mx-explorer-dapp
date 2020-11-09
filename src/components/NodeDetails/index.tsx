import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, BlocksTable, Loader, PageState } from 'sharedComponents';
import { useLocation, useParams } from 'react-router-dom';
import { IdentityType, NodeType } from 'context/state';
import Alert from './Alert';
import NodeInformation from './NodeInformation';
import Identity from './Identity';
import NetworkMetrics from './NetworkMetrics';
import Rounds, { RoundType } from './Rounds';
import RatingsChart, { RatingType } from './RatingsChart';
import FailedBlocks from 'sharedComponents/BlocksTable/FailedBlocks';
import NoBlocks from 'sharedComponents/BlocksTable/NoBlocks';
import { BlockType } from 'sharedComponents/BlocksTable';

const NodeDetails = () => {
  const ref = React.useRef(null);
  const { publicKey } = useParams() as any;
  const { search } = useLocation();
  const { getNode, getIdentity, getNodeRounds, getNodeBlocks, getHistoricRatings } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(true);
  const [node, setNode] = React.useState<NodeType>();
  const [identity, setIdentity] = React.useState<IdentityType>();
  const [rounds, setRounds] = React.useState<RoundType[]>();
  const [ratings, setRatings] = React.useState<RatingType[]>();
  const [blocks, setBlocks] = React.useState<{
    data: BlockType[];
    success: boolean | undefined;
  }>({
    data: [],
    success: undefined,
  });

  const fetchNodes = () => {
    setDataReady(undefined);
    Promise.all([getNode(publicKey)]).then(([nodeData]) => {
      const newNode: NodeType = nodeData.data;
      if (newNode) {
        Promise.all([
          getIdentity(newNode.identity),
          getNodeRounds(publicKey),
          getNodeBlocks(publicKey),
          getHistoricRatings(publicKey),
        ]).then(([identityData, roundsData, blocksData, historicRatingsData]) => {
          if (ref.current !== null) {
            setNode(newNode);
            setIdentity(identityData.data);
            // TODO: undo
            // setBlocks(blocksData);
            setBlocks({
              data: blocksData.data,
              success: true,
            });
            // TODO: redo
            setRounds(
              roundsData.data.map((round: any) => ({
                key: round.id,
                value: round.blockWasProposed,
              }))
            );
            setRatings(historicRatingsData.data);
            setDataReady(nodeData.success);
          }
        });
      }
    });
  };

  React.useEffect(fetchNodes, [search]);

  return (
    <div ref={ref}>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to locate this node"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
      {dataReady === true && node && (
        <>
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Node Information
                </h3>
              </div>
            </div>
            <Alert node={node} />
            <div className="row">
              <div className="col-md-8 mt-spacer">
                <NodeInformation node={node} />
              </div>
              <div className="col-md-4 mt-spacer">
                {identity && <Identity identity={identity} />}
              </div>
            </div>
            <div className="row">
              <div className="mt-spacer col-md-4">
                <NetworkMetrics node={node} />
              </div>

              <div className="col-md-4 mt-spacer">
                {ratings && <RatingsChart ratings={ratings} />}
              </div>
              <div className="col-md-4 mt-spacer">{rounds && <Rounds rounds={rounds} />}</div>
            </div>
            {node.nodeType === 'validator' && (
              <div className="row">
                <div className="col-12 mt-spacer">
                  <div className="card">
                    {blocks.success === false && <FailedBlocks />}
                    {blocks.success && (
                      <>
                        {blocks.data.length === 0 && (
                          <NoBlocks
                            title={
                              node.peerType === 'waiting'
                                ? 'Validator not in consensus'
                                : 'No blocks'
                            }
                          />
                        )}
                        {blocks.data.length > 0 && (
                          <>
                            <div className="card-header">
                              <div className="card-header-item">
                                <h6 className="m-0">
                                  Last {blocks.data.length} proposed Blocks in Current Epoch
                                </h6>
                              </div>
                            </div>
                            <div className="card-body p-0">
                              <BlocksTable blocks={blocks.data} shardId={undefined} />
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
  );
};

export default NodeDetails;
