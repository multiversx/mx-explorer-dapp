import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, adapter, AddressesTable, Pager } from 'sharedComponents';
import NoAddresses from 'sharedComponents/AddressesTable/NoAddresses';
import FailedAddresses from 'sharedComponents/AddressesTable/FailedAddresses';
import { AddressDetailsType } from '../Address/AddressDetails';
import { useSize, useURLSearchParams } from 'helpers';

const Transactions = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { page } = useURLSearchParams();

  const { size } = useSize();

  const { getAddresses, getAddressesCount } = adapter();

  const [addresses, setAddresses] = React.useState<AddressDetailsType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalAddresses, setTotalAddresses] = React.useState<number | '...'>('...');

  const fetchAddresses = () => {
    getAddresses({
      size,
    }).then(({ addresses, success }) => {
      if (ref.current !== null) {
        if (success) {
          setAddresses(addresses);
        }
        setDataReady(success);
      }
    });
  };

  const fetchAddressesCount = () => {
    getAddressesCount({}).then(({ count, success }) => {
      if (ref.current !== null && success) {
        setTotalAddresses(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(() => {
    fetchAddresses();
    fetchAddressesCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedAddresses />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">Addresses</span>
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  {addresses && addresses.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <AddressesTable addresses={addresses} />
                      </div>

                      <div className="card-footer">
                        <Pager
                          page={String(page)}
                          total={
                            totalAddresses !== '...'
                              ? Math.min(totalAddresses, 10000)
                              : totalAddresses
                          }
                          itemsPerPage={25}
                          show={addresses.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoAddresses />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
