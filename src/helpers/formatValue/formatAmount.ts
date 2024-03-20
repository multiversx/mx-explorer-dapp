import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { MAX_DISPLAY_ZERO_DECIMALS } from 'appConstants';

function format(
  big: string,
  decimals: number,
  digits: number,
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

  if (decimals !== 0) {
    // make sure we have enough characters
    while (array.length < decimals + 1) {
      array.unshift('0');
    }

    // add our dot
    array.splice(array.length - decimals, 0, '.');

    // make sure there are enough digits after the dot
    while (array.length - array.indexOf('.') <= digits) {
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
      const digitsIndex = array.indexOf('.') + digits + 1;
      const sliceIndex = Math.max(digitsIndex, nonZeroDigitIndex);
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
      const displayDecimals = zeroDecimals > 0 ? zeroDecimals + digits : digits;

      array = array.slice(0, array.indexOf('.') + displayDecimals + 1);
    }
  }

  if (addCommas) {
    // add comas every 3 characters
    array = array.reverse();
    const reference = decimals
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
      digits === 0 && !showLastNonZeroDecimal
        ? string.split('.').join('')
        : string;
  }

  if (negative) {
    output = '-' + output;
  }

  return output;
}

interface FormatAmountType {
  input: string;
  decimals: number;
  digits: number;
  showLastNonZeroDecimal: boolean;
  addCommas?: boolean;
}

export const formatAmount = ({
  input,
  decimals,
  digits,
  showLastNonZeroDecimal = false,
  addCommas = true
}: FormatAmountType) => {
  if (!stringIsInteger(input, false)) {
    throw new Error('Invalid input');
  }

  return format(input, decimals, digits, showLastNonZeroDecimal, addCommas);
};
