import React from 'react';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { adapter, Loader, PageState } from 'sharedComponents';
import { ValidatorType } from 'context/validators';
import { useLocation, useParams } from 'react-router-dom';
import Alert from './Alert';
import NodeInformation from './NodeInformation';

const NodeDetails = () => {
  const ref = React.useRef(null);
  const { publicKey } = useParams() as any;
  const { search } = useLocation();
  const { getNode, getIdentity, getNewRounds } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>(true);
  const [node, setNode] = React.useState<ValidatorType>();

  const fetchNodes = () => {
    setDataReady(undefined);
    Promise.all([getNode(publicKey)]).then(([nodeData]) => {
      // if (ref.current !== null) {
      setNode(nodeData.data);
      Promise.all([getNewRounds(publicKey)]).then(([nodeData]) => {
        // if (ref.current !== null) {
        // setNode(nodeData.data);
        // setDataReady(nodeData.success);
        // }
      });
      setDataReady(nodeData.success);
      // }
    });
  };

  React.useEffect(fetchNodes, [search]);

  return (
    <div ref={ref}>
      {dataReady === undefined && <Loader />}
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
                {/* <BrandInformation publicKey={state.publicKey} /> */}
              </div>
            </div>
          </div>
        </>
      )}
      {dataReady === false && (
        <PageState
          icon={faCogs}
          title="Unable to locate this node"
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}
    </div>
  );
};

export default NodeDetails;
