import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { isHash, useNetworkRoute } from 'helpers';
import { Loader, adapter, PageState } from 'sharedComponents';
import BlockData, { BlockDataType } from './BlockData';

const BlockDetails = () => {
  const ref = React.useRef(null);
  const networkRoute = useNetworkRoute();
  const { getBlock } = adapter();
  const { hash: blockId } = useParams() as any;

  const [state, setState] = React.useState<BlockDataType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const invalid = blockId && !isHash(blockId);

  const fetchBlock = () => {
    if (!invalid) {
      getBlock(blockId).then(({ success, block, nextHash }) => {
        if (ref.current !== null) {
          setState({ block, nextHash });
          setDataReady(success);
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchBlock, [blockId]); // run the operation only once since the parameter does not change

  return invalid ? (
    <Redirect to={networkRoute(`/not-found`)} />
  ) : (
    <>
      {dataReady === undefined && <Loader />}

      {dataReady === false && (
        <PageState
          icon={faCube}
          title="Unable to locate this block hash"
          description={
            <div className="px-spacer">
              <span className="text-break-all">{blockId}</span>
            </div>
          }
          className="py-spacer my-auto"
          dataTestId="errorScreen"
        />
      )}

      <div className="block-details" ref={ref}>
        {dataReady === true && state && state.block.hash && (
          <div className="container page-content">
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
