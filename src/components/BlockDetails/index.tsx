import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { isHash, networkRoute } from 'helpers';
import { Loader, adapter, PageState } from 'sharedComponents';
import { initialState } from 'sharedComponents/Adapter/functions/getBlock';
import BlockData, { BlockDataType } from './BlockData';

const BlockDetails = () => {
  const params: any = useParams();

  const { hash: blockId } = params;

  const ref = React.useRef(null);

  const { activeNetworkId } = useGlobalState();

  const { getBlock } = adapter();

  const [state, setState] = React.useState<BlockDataType>(initialState);
  const [blockFetched, setBlockFetched] = React.useState<boolean | undefined>();

  const invalid = blockId && !isHash(blockId);

  const fetchBlock = () => {
    if (!invalid) {
      getBlock({ blockId }).then((data) => {
        if (ref.current !== null) {
          setState(data);
          setBlockFetched(data.blockFetched);
        }
      });
    }
  };

  React.useEffect(fetchBlock, [blockId]); // run the operation only once since the parameter does not change

  return invalid ? (
    <Redirect to={networkRoute({ to: `/not-found`, activeNetworkId })} />
  ) : (
    <div className="block-details" ref={ref}>
      <div className="container py-spacer">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-spacer" data-testid="title">
              Block Details
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {blockFetched === undefined && <Loader dataTestId="loader" />}
            {blockFetched === false && (
              <div className="card card-small">
                <div className="card-body ">
                  <PageState
                    icon={faCube}
                    title="Unable to locate this block hash"
                    description={blockId}
                    className="py-spacer d-flex h-100 align-items-center justify-content-center"
                    dataTestId="errorScreen"
                  />
                </div>
              </div>
            )}
            {blockFetched === true && state.block.hash && <BlockData {...state} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
