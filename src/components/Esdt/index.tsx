import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, adapter, Pager, NetworkLink } from 'sharedComponents';
import NoEsdt from './NoEsdt';
import FailedEsdt from './FailedEsdt';
import { types, urlBuilder, useSize, useURLSearchParams } from 'helpers';

const Transactions = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { page } = useURLSearchParams();
  const { size } = useSize();
  const { getEsdt, getEsdtCount } = adapter();

  const [esdt, setEsdt] = React.useState<types.EsdtType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalEsdt, setTotalEsdt] = React.useState<number | '...'>('...');

  const fetchEsdt = () => {
    getEsdt(size).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          setEsdt(data);
        }
        setDataReady(success);

        // setEsdt([{ name: 'test' }]);
        // setDataReady(true);
      }
    });
  };

  const fetchEsdtCount = () => {
    getEsdtCount().then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalEsdt(Math.min(count, 10000));
      }

      //setTotalEsdt(1);
    });
  };

  React.useEffect(() => {
    fetchEsdt();
    fetchEsdtCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedEsdt />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container pt-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4">
                  <span data-testid="title">ESDT</span>
                </h3>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card">
                  {esdt && esdt.length > 0 ? (
                    <>
                      <div className="card-body border-0 p-0">
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody data-testid="esdtTable">
                              {esdt.map((coin, i) => (
                                <tr key={i}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <NetworkLink
                                        to={urlBuilder.esdtDetails(coin.name)}
                                        className="trim-only-sm"
                                        data-testid={`esdtLink${i}`}
                                      >
                                        {coin.name}
                                      </NetworkLink>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card-footer">
                        <Pager
                          page={String(page)}
                          total={totalEsdt !== '...' ? Math.min(totalEsdt, 10000) : totalEsdt}
                          itemsPerPage={25}
                          show={esdt.length > 0}
                        />
                      </div>
                    </>
                  ) : (
                    <NoEsdt />
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
