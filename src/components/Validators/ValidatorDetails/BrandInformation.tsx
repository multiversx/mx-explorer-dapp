import * as React from 'react';
import { DetailItem, NetworkLink, Trim } from 'sharedComponents';
import { useGlobalState } from 'context';
import { validatorsRoutes } from 'routes';
import { stake, cumulativeStakePercent } from './../ValidatorsBrandTable/BrandRow';
import { groupByBrandAndSort } from './../ValidatorsBrandTable/helpers/brandHelper';

const BrandInformation = ({ publicKey }: { publicKey: string }) => {
  const { brandData, validatorData } = useGlobalState();

  const sortedBrands = groupByBrandAndSort({
    brandData,
    allValidators: [...validatorData.validators],
    totalValidators: validatorData.validators.length,
  });

  const brand = sortedBrands.find((b) => b.validators.some((v: any) => v.publicKey === publicKey));

  return brand !== undefined ? (
    <div className="card card-small" data-testid="brandContainer">
      <div className="card-header border-0 p-0">
        <div className="card-header-item border-bottom">
          <div className="brand-header-item">
            <img
              className={`mr-3 avatar rounded-circle shadow-sm ${brand.avatar ? '' : 'gray'}`}
              src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
              alt={brand.name}
              height="42"
            />

            {brand.identity ? (
              <NetworkLink to={`${validatorsRoutes.index}/${brand.identity}`}>
                {brand.name ? brand.name : 'N/A'}
              </NetworkLink>
            ) : (
              <>{brand.name ? <Trim text={brand.name} /> : 'N/A'}</>
            )}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Stake" colWidth="6">
            {stake(brand)}
          </DetailItem>
          <DetailItem title="Stake percent" colWidth="6">
            {cumulativeStakePercent(brand)}
          </DetailItem>
          <DetailItem title="Nodes" colWidth="6">
            {brand.validators.length}
          </DetailItem>
          <DetailItem title="Score" colWidth="6">
            {Math.floor(brand.score).toLocaleString()}
          </DetailItem>
        </div>
      </div>
    </div>
  ) : null;
};

export default BrandInformation;
