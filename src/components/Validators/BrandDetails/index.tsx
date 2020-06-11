import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader } from 'sharedComponents';
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
      const foundBrand = brandData.find(b => b.identity === identity);
      if (foundBrand) {
        const [found] = groupByBrandAndSort({
          brandData: [foundBrand],
          allValidators: [...validatorData.validators],
        });
        setBrand(found);
      } else {
        setNotFound(true);
      }
    }
  };

  React.useEffect(setBrandData, [success, brandData, validatorData]);

  const labelClass = 'col-lg-4 card-label';
  const dataClass = 'col-lg-8';
  const validatorLabelClass = 'col-lg-3 card-label';
  const validatorDataClass = 'col-lg-9';

  return notFound ? (
    <PageNotFound />
  ) : (
    <div className="container pt-3 pb-3" ref={ref}>
      <div className="row">
        <div className="col-12">
          <h4>Validator Details</h4>
        </div>
      </div>
      {brand !== undefined ? (
        <>
          <div className="row mb-4" data-testid="brandDetailsContainer">
            <div className="col-md-6 col-xs-12">
              <div className="card branded-validators">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="d-xl-none d-lg-none d-sm-block">&nbsp;</div>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          <img
                            className={brand.avatar ? 'avatar' : 'avatar gray'}
                            src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
                            alt={brand.name}
                            height="42"
                          />
                        </div>
                        {brand.name ? brand.name : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={validatorLabelClass}>Location</div>
                    <div className={validatorDataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          {brand.location ? (
                            brand.location
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={validatorLabelClass}>Twitter</div>
                    <div className={validatorDataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          {brand.twitter ? (
                            <a href={brand.twitter}>{brand.twitter.split('/').pop()}</a>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={validatorLabelClass}>Web</div>
                    <div className={validatorDataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          {brand.web ? (
                            <a href={brand.web}>{brand.web}</a>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xs-12 mt-4 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className={labelClass}>Stake</div>
                    <div className={dataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">{stake(brand)}</div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={labelClass}>Stake percent</div>
                    <div className={dataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">{cumulativeStakePercent(brand)}</div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={labelClass}>Nodes</div>
                    <div className={dataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">{brand.validators.length}</div>
                      </div>
                    </div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className={labelClass}>Score</div>
                    <div className={dataClass}>
                      <div className="d-flex align-items-center">
                        <div className="mr-3">{Math.floor(brand.score).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>Nodes</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table className="table mb-2">
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
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default BrandDetails;
