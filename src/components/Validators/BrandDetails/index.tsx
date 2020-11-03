import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { DetailItem, Loader } from 'sharedComponents';
import { groupByBrandAndSort } from './../ValidatorsBrandTable/helpers/brandHelper';
import { stake, cumulativeStakePercent } from './../ValidatorsBrandTable/BrandRow';
import useSetValidatorsData from './../useSetValidatorsData';
import { BrandType } from './../ValidatorsBrandTable/BrandTable';
import BrandDetailsRow from './../ValidatorsBrandTable/BrandDetailsRow';
import PageNotFound from 'components/PageNotFoud';

const BrandDetails = () => {
  const ref = React.useRef(null);
  const { brandData, validatorData } = useGlobalState();
  const { identity } = useParams();
  const [brand, setBrand] = React.useState<BrandType>();
  const [notFound, setNotFound] = React.useState(false);
  const success = useSetValidatorsData(ref);

  const setBrandData = () => {
    if (success && brandData.length > 0 && validatorData.validatorsAndObservers.length > 0) {
      const foundBrand = brandData.find((b) => b.identity === identity);
      if (foundBrand) {
        const allValidators = validatorData.validators.filter((v) =>
          foundBrand.publicKeys.includes(v.publicKey)
        );
        const [found] = groupByBrandAndSort({
          brandData: [foundBrand],
          allValidators,
          totalValidators: validatorData.validators.length,
        });
        setBrand(found);
      } else {
        setNotFound(true);
      }
    }
  };

  React.useEffect(setBrandData, [success, brandData, validatorData]);

  return notFound ? (
    <PageNotFound />
  ) : (
    <>
      {brand === undefined && <Loader />}

      <div ref={ref}>
        {brand !== undefined && (
          <div className="container py-spacer" ref={ref}>
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Validator Details
                </h3>
              </div>
            </div>

            <div className="row" data-testid="brandDetailsContainer">
              <div className="col-12 col-md-6">
                <div className="card card-small">
                  <div className="card-header border-0 p-0">
                    <div className="card-header-item border-bottom d-flex align-items-center px-3 py-3 py-lg-2">
                      <div className="mr-3">
                        <img
                          className={`avatar rounded-circle shadow-sm ${
                            brand.avatar ? '' : 'gray'
                          }`}
                          src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
                          alt={brand.name}
                          height="42"
                        />
                      </div>
                      {brand.name ? brand.name : 'N/A'}
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Location" colWidth="3">
                        {brand.location ? brand.location : <span className="text-muted">N/A</span>}
                      </DetailItem>

                      <DetailItem title="Twitter" colWidth="3">
                        {brand.twitter ? (
                          <a target={`_blank`} href={brand.twitter}>
                            {brand.twitter.split('/').pop()}
                          </a>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </DetailItem>

                      <DetailItem title="Web" colWidth="3">
                        {brand.web ? (
                          <a target={`_blank`} href={brand.web}>
                            {brand.web}
                          </a>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </DetailItem>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mt-spacer mt-md-0">
                <div className="card card-small">
                  <div className="card-body p-0">
                    <div className="container-fluid">
                      <DetailItem title="Stake" colWidth="4">
                        {stake(brand)}
                      </DetailItem>

                      <DetailItem title="Stake percent" colWidth="4">
                        {cumulativeStakePercent(brand)}
                      </DetailItem>

                      <DetailItem title="Nodes" colWidth="4">
                        {brand.validators.length}
                      </DetailItem>

                      <DetailItem title="Score" colWidth="4">
                        {Math.floor(brand.score).toLocaleString()}
                      </DetailItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-spacer">
                <div className="card card-small">
                  <div className="card-header border-0 p-0">
                    <div className="card-header-item border-bottom p-3">
                      <h6 className="m-0">Nodes</h6>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Public Key</th>
                            <th>Node Name</th>
                            <th>Shard</th>
                            <th>Version</th>
                            <th className="text-right">Uptime</th>
                            <th className="text-right">Status</th>
                            <th className="text-right">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brand.validators.map((validator, i) => (
                            <BrandDetailsRow
                              key={validator.publicKey}
                              rowIndex={i}
                              validator={validator}
                            />
                          ))}
                        </tbody>
                      </table>
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

export default BrandDetails;
