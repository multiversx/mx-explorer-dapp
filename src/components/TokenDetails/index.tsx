import * as React from 'react';
import { useParams } from 'react-router-dom';
import { types } from 'helpers';
import { Loader, adapter, DetailItem } from 'sharedComponents';
import FailedTokenDetails from './FailedTokenDetails';

const TokenDetails = () => {
  const params: any = useParams();
  const { hash: tokenId } = params;

  const ref = React.useRef(null);

  const { getTokenDetails } = adapter();

  const [tokenDetails, setTokenDetails] = React.useState<types.TokenType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    getTokenDetails(tokenId).then(({ success, data }) => {
      if (ref.current !== null) {
        setTokenDetails(data);
        setDataReady(success);

        // setTokenDetails({ name: 'test' });
        // setDataReady(true);
      }
    });
  };

  React.useEffect(fetchTokenDetails, [tokenId]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTokenDetails tokenId={tokenId} />}

      <div ref={ref}>
        {dataReady === true && tokenDetails && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4" data-testid="title">
                  Token Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Name">{tokenDetails.name}</DetailItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TokenDetails;
