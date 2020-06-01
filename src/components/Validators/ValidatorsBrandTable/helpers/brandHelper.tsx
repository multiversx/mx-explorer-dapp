import { trimHash } from 'helpers';
import { BrandDataType, BrandType } from '../index';
import { ValidatorType } from '../../index';

export function groupByBrandAndSort({
  brandData,
  allValidators,
}: {
  brandData: BrandDataType[];
  allValidators: ValidatorType[];
}) {
  const sortedBrands: BrandType[] = [];
  const stakePerValidator = 2500000;
  const blockchainTotalStake = allValidators.length * stakePerValidator;

  brandData.forEach((brand: BrandDataType) => {
    const validators: ValidatorType[] = allValidators.filter(validator =>
      brand.publicKeys.includes(validator.publicKey)
    );

    // remove owned nodes from allValidators
    validators.forEach(validator => {
      const index = allValidators.indexOf(validator);

      if (index > -1) {
        allValidators.splice(index, 1);
      }
    });

    // sort DESC
    validators.sort((a, b) => b.rating - a.rating);
    sortedBrands.push(generateBrandTypeWithStats({ brand, validators, stakePerValidator }));
  });

  if (sortedBrands.every(b => b.score === 0)) {
    sortedBrands.sort((a, b) => b.stake - a.stake);
  }

  // add the rest of the brandless validators
  allValidators.forEach(validator => {
    const brand = {
      name: trimHash(validator.publicKey),
      avatar: '',
      publicKeys: [validator.publicKey],
      identity: '',
    };
    const validators = [validator];

    sortedBrands.push(generateBrandTypeWithStats({ brand, validators, stakePerValidator }));
  });

  // sort DESC
  sortedBrands.sort((a, b) => b.score - a.score);

  // calculate STAKEBARS width
  sortedBrands.forEach((brand, i, arr) => {
    const prevBrand = arr[i - 1];
    brand.stakePercent = (brand.stake / blockchainTotalStake) * 100;

    brand.overallStakePercent = prevBrand
      ? prevBrand.overallStakePercent + prevBrand.stakePercent
      : 0;
  });

  return sortedBrands;
}

function generateBrandTypeWithStats({
  brand,
  validators,
  stakePerValidator,
}: {
  brand: BrandDataType;
  validators: ValidatorType[];
  stakePerValidator: number;
}) {
  // SCORE
  let score = 0;
  if (validators && validators.length > 0) {
    score = validators
      .map(o => o.ratingModifier)
      .reduce((a, c) => {
        return a + c;
      });
    score = score * 100;
  }

  // STAKE
  const stake = stakePerValidator * validators.length;

  const { name, avatar } = brand;

  return {
    name,
    avatar,
    score,
    stake,
    stakePercent: 0,
    overallStakePercent: 0,
    validators,
  };
}
