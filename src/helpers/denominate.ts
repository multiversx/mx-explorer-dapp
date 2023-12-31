import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { MAX_DISPLAY_ZERO_DECIMALS } from 'appConstants';

function format(
  big: string,
  denomination: number,
  decimals: number,
  showLastNonZeroDecimal: boolean,
  addCommas: boolean,
  maxDisplayZeroDecimals = MAX_DISPLAY_ZERO_DECIMALS
) {
  showLastNonZeroDecimal =
    typeof showLastNonZeroDecimal !== 'undefined'
      ? showLastNonZeroDecimal
      : false;

  let array = big.toString().split('');

  let negative = false;
  if (array[0] === '-') {
    array.shift();
    negative = true;
  }

  if (denomination !== 0) {
    // make sure we have enough characters
    while (array.length < denomination + 1) {
      array.unshift('0');
    }

    // add our dot
    array.splice(array.length - denomination, 0, '.');

    // make sure there are enough decimals after the dot
    while (array.length - array.indexOf('.') <= decimals) {
      array.push('0');
    }

    if (showLastNonZeroDecimal) {
      let nonZeroDigitIndex = 0;
      for (let i = array.length - 1; i > 0; i--) {
        if (array[i] !== '0') {
          nonZeroDigitIndex = i + 1;
          break;
        }
      }
      const decimalsIndex = array.indexOf('.') + decimals + 1;
      const sliceIndex = Math.max(decimalsIndex, nonZeroDigitIndex);
      array = array.slice(0, sliceIndex);
    } else {
      let zeroDecimals = 0;
      const minDecimalLength = Math.min(
        array.length - array.indexOf('.'),
        maxDisplayZeroDecimals
      );
      for (let i = 1; i <= minDecimalLength; i++) {
        if (array?.[array.indexOf('.') + i] === '0') {
          zeroDecimals++;
        } else {
          break;
        }
      }
      const displayDecimals =
        zeroDecimals > 0 ? zeroDecimals + decimals : decimals;

      array = array.slice(0, array.indexOf('.') + displayDecimals + 1);
    }
  }

  if (addCommas) {
    // add comas every 3 characters
    array = array.reverse();
    const reference = denomination
      ? array.length - array.indexOf('.') - 1
      : array.length;
    const count = Math.floor(reference / 3);
    for (let i = 1; i <= count; i++) {
      const position = array.indexOf('.') + 3 * i + i;
      if (position !== array.length) {
        array.splice(position, 0, ',');
      }
    }
    array = array.reverse();
  }

  const allDecimalsZero = array
    .slice(array.indexOf('.') + 1)
    .every((digit) => digit.toString() === '0');

  const string = array.join('');

  let output;
  if (allDecimalsZero) {
    output = string.split('.')[0];
  } else {
    output =
      decimals === 0 && !showLastNonZeroDecimal
        ? string.split('.').join('')
        : string;
  }

  if (negative) {
    output = '-' + output;
  }

  return output;
}

interface DenominateType {
  input: string;
  denomination: number;
  decimals: number;
  showLastNonZeroDecimal: boolean;
  addCommas?: boolean;
}

export const denominate = ({
  input,
  denomination,
  decimals,
  showLastNonZeroDecimal = false,
  addCommas = true
}: DenominateType) => {
  if (!stringIsInteger(input, false)) {
    throw new Error('Invalid input');
  }

  return format(
    input,
    denomination,
    decimals,
    showLastNonZeroDecimal,
    addCommas
  );
};
