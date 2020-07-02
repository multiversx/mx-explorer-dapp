import * as React from 'react';
import { TestnetLink } from 'sharedComponents';
import { useGlobalState } from 'context';
import { validatorsRoutes } from 'routes';
import { stake, cumulativeStakePercent } from './../ValidatorsBrandTable/BrandRow';
import { groupByBrandAndSort } from './../ValidatorsBrandTable/helpers/brandHelper';

const BrandInformation = ({ publicKey }: { publicKey: string }) => {
  const { brandData, validatorData } = useGlobalState();

  const sortedBrands = groupByBrandAndSort({
    brandData,
    allValidators: [...validatorData.validators],
  });

  const brand = sortedBrands.find((b) => b.validators.some((v: any) => v.publicKey === publicKey));

  const labelClass = 'col-lg-5 card-label';
  const dataClass = 'col-lg-7';

  return brand !== undefined ? (
    <div data-testid="brandContainer">
      <div className="card branded-validators mt-sm-5 mt-md-0">
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
                <TestnetLink to={`${validatorsRoutes.index}/${brand.identity}`}>
                  {brand.name ? brand.name : 'N/A'}
                </TestnetLink>
              </div>
            </div>
          </div>
          <hr className="hr-space" />
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
  ) : null;
};

export default BrandInformation;
