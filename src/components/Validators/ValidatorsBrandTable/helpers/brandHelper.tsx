import { JsonBrandType, BrandType } from '../index';
import { ValidatorType } from '../../index';

export function groupByBrandAndSort({
  brandsJson,
  allValidators,
}: {
  brandsJson: JsonBrandType[];
  allValidators: ValidatorType[];
}) {
  const sortedBrands: BrandType[] = [];
  const stakePerValidator = 2500000;
  const blockchainTotalStake = allValidators.length * stakePerValidator;

  brandsJson.forEach((jsonBrand: JsonBrandType) => {
    const validators: ValidatorType[] = allValidators.filter(validator =>
      jsonBrand.nodesPubKeys.includes(validator.publicKey)
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

    sortedBrands.push(generateBrandTypeWithStats({ jsonBrand, validators, stakePerValidator }));
  });

  // add the rest of the brandless validators
  allValidators.forEach(validator => {
    const jsonBrand = {
      name: validator.nodeDisplayName,
      avatar: '',
      nodesPubKeys: [validator.publicKey],
    };
    const validators = [validator];

    sortedBrands.push(generateBrandTypeWithStats({ jsonBrand, validators, stakePerValidator }));
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
  jsonBrand,
  validators,
  stakePerValidator,
}: {
  jsonBrand: JsonBrandType;
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

  const { name, avatar } = jsonBrand;

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
