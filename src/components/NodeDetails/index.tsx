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
  const [node, setNode] = React.useState<{
    data?: NodeType;
    success: boolean | undefined;
  }>({
    success: undefined,
  });
  const [identity, setIdentity] = React.useState<{
    data?: IdentityType;
    success: boolean | undefined;
  }>({
    success: undefined,
  });
  const [rounds, setRounds] = React.useState<{
    data: RoundType[];
    success: boolean | undefined;
  }>({
    data: [],
    success: undefined,
  });
  const [ratings, setRatings] = React.useState<{
    data: RatingType[];
    success: boolean | undefined;
  }>({
    data: [],
    success: undefined,
  });
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
      if (nodeData.success) {
        Promise.all([
          getIdentity(nodeData.data.identity),
          getNodeRounds(publicKey),
          getNodeBlocks(publicKey),
          getHistoricRatings(publicKey),
        ]).then(([identityData, roundsData, blocksData, historicRatingsData]) => {
          if (ref.current !== null) {
            setNode(nodeData);
            setIdentity(identityData);
            // TODO: undo
            // setBlocks(blocksData);
            setBlocks({
              data: blocksData.data,
              success: false,
            });
            // TODO: redo
            setRounds({
              data: roundsData.data.map((round: any) => ({
                key: round.id,
                value: round.blockWasProposed,
              })),
              success: false, // roundsData.success,
            });
            // setRatings(historicRatingsData);
            setRatings({
              data: historicRatingsData.data,
              success: false,
            });
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
      {dataReady === true && node.data !== undefined && (
        <>
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Node Information
                </h3>
              </div>
            </div>
            <Alert node={node.data} />
            <div className="row">
              <div className={`mt-spacer ${identity.success ? 'col-md-8' : 'col-12'}`}>
                <NodeInformation node={node.data} colWidth={identity.success ? '3' : '2'} />
              </div>
              {identity.success && identity.data !== undefined && (
                <div className="col-md-4 mt-spacer">
                  <Identity identity={identity.data} />
                </div>
              )}
            </div>
            <div className="row">
              <div className="mt-spacer col-md-4">
                <NetworkMetrics node={node.data} />
              </div>
              <div className="col-md-4 mt-spacer">
                <RatingsChart ratings={ratings} />
              </div>
              <div className="col-md-4 mt-spacer">
                <Rounds rounds={{ ...rounds, peerType: node.data.peerType }} />
              </div>
            </div>
            {node.data.nodeType === 'validator' && (
              <div className="row">
                <div className="col-12 mt-spacer">
                  <div className="card">
                    {blocks.success === false && <FailedBlocks />}
                    {blocks.success && (
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
