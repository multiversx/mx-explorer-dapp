import React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { getAddressDetails } from './helpers/asyncRequests';
import { Denominate } from './../../sharedComponents';

type StateType = {
  address: string;
  code: string;
  balance: string;
};

const initialState = {
  address: '',
  code: '',
  balance: '',
  detailsFetched: true,
};

const AddressDetails: React.FC = () => {
  let ref = React.useRef(null);
  let { addressId } = useParams();
  const [state, setState] = React.useState<StateType>(initialState);

  const {
    activeTestnet: { nodeUrl },
  } = useGlobalState();

  React.useEffect(() => {
    if (addressId && ref.current !== null) {
      getAddressDetails({ nodeUrl, addressId }).then((data: any) => setState(data));
    }
  }, [nodeUrl, addressId]);

  const Address = (
    <div ref={ref}>
      <div>
        <div className="row">
          <div className="col-12">
            <h4>Address Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-1 card-label">Address</div>
                  <div className="col-lg-11">{addressId}</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-1 card-label">Balance</div>
                  <div className="col-lg-11">
                    {state.balance && <Denominate value={state.balance} />}
                  </div>
                </div>
                {state.code && (
                  <>
                    <hr className="hr-space" />
                    <div className="row">
                      <div className="col-lg-1 card-label">Code</div>
                      <div className="col-lg-11">
                        <textarea
                          readOnly
                          className="form-control col-lg-12 cursor-text"
                          rows={2}
                          defaultValue={state.code}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4" />
    </div>
  );
  return addressId ? Address : null;
};

export default AddressDetails;
