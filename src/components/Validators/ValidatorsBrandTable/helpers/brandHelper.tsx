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
    brand.stakeBarWidth = (brand.stake / blockchainTotalStake) * 100;

    brand.overallStakeBarWidth = prevBrand
      ? prevBrand.overallStakeBarWidth + prevBrand.stakeBarWidth
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

  // STATUS - NOT USED
  let cumulativeStatus = 'Online';
  const offlineValidators: number = validators.filter(validator => validator.isActive === false)
    .length;

  if (offlineValidators === validators.length) {
    cumulativeStatus = 'Offline';
  } else if (offlineValidators > 0) {
    cumulativeStatus = 'Mixed';
  }

  // UPTIME - NOT USED
  let cumulativeUptime = 0;

  validators.forEach(validator => {
    let uptime = 0;

    if (validator.totalUpTimeSec !== 0 || validator.totalDownTimeSec !== 0) {
      uptime = Math.floor(
        (validator.totalUpTimeSec * 100) / (validator.totalUpTimeSec + validator.totalDownTimeSec)
      );
    } else {
      if (
        validator.totalUpTimeSec === 0 &&
        validator.totalDownTimeSec === 0 &&
        validator.isActive === true
      ) {
        uptime = 100;
      }

      if (
        validator.totalUpTimeSec === 0 &&
        validator.totalDownTimeSec === 0 &&
        validator.isActive === false
      ) {
        uptime = 0;
      }
    }

    cumulativeUptime += uptime;
  });

  if (cumulativeUptime > 0) {
    cumulativeUptime = cumulativeUptime / validators.length;
  }

  const { name, avatar } = jsonBrand;

  return {
    name,
    avatar,
    cumulativeUptime,
    cumulativeStatus,
    score,
    stake,
    stakeBarWidth: 0,
    overallStakeBarWidth: 0,
    validators,
  };
}
