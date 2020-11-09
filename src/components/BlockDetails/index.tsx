import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { isHash, networkRoute } from 'helpers';
import { Loader, adapter, PageState } from 'sharedComponents';
import BlockData, { BlockDataType } from './BlockData';

const BlockDetails = () => {
  const params: any = useParams();

  const { hash: blockId } = params;

  const ref = React.useRef(null);

  const { activeNetworkId } = useGlobalState();

  const { getBlock } = adapter();

  const [state, setState] = React.useState<BlockDataType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const invalid = blockId && !isHash(blockId);

  const fetchBlock = () => {
    if (!invalid) {
      getBlock({ blockId }).then(({ success, block, consensusItems, nextHash, proposer }) => {
        if (ref.current !== null) {
          setState({ block, consensusItems, nextHash, proposer });
          setDataReady(success);
        }
      });
    }
  };

  React.useEffect(fetchBlock, [blockId]); // run the operation only once since the parameter does not change

  return invalid ? (
    <Redirect to={networkRoute({ to: `/not-found`, activeNetworkId })} />
  ) : (
    <>
      {dataReady === undefined && <Loader />}

      {dataReady === false && (
        <PageState
          icon={faCube}
          title="Unable to locate this block hash"
          description={blockId}
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}

      <div className="block-details" ref={ref}>
        {dataReady === true && state && state.block.hash && (
          <div className="container py-spacer">
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Block Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <BlockData {...state} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlockDetails;
