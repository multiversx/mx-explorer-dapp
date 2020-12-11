import * as React from 'react';
import { useParams } from 'react-router-dom';
import { types } from 'helpers';
import { Loader, adapter, DetailItem } from 'sharedComponents';
import FailedEsdtDetails from './FailedEsdtDetails';

const EsdtDetails = () => {
  const params: any = useParams();
  const { hash: esdtId } = params;

  const ref = React.useRef(null);

  const { getEsdtDetails } = adapter();

  const [esdtDetails, setEsdtDetails] = React.useState<types.EsdtType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchEsdtDetails = () => {
    getEsdtDetails(esdtId).then(({ success, data }) => {
      if (ref.current !== null) {
        setEsdtDetails(data);
        setDataReady(success);

        // setEsdtDetails({ name: 'test' });
        // setDataReady(true);
      }
    });
  };

  React.useEffect(fetchEsdtDetails, [esdtId]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedEsdtDetails esdtId={esdtId} />}

      <div ref={ref}>
        {dataReady === true && esdtDetails && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4" data-testid="title">
                  ESDT Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Name">{esdtDetails.name}</DetailItem>
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

export default EsdtDetails;
