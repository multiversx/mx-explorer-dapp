function format(big: string, denomination: number, decimals: number, showAllDecimals: boolean) {
  showAllDecimals = typeof showAllDecimals !== 'undefined' ? showAllDecimals : false;
  let array = big.toString().split('');
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
    // trim unnecessary characters after the dot
    if (!showAllDecimals) {
      array = array.slice(0, array.indexOf('.') + decimals + 1);
    }
  }
  // add comas every 3 characters
  array = array.reverse();
  const reference = denomination ? array.length - array.indexOf('.') - 1 : array.length;
  const count = Math.floor(reference / 3);
  for (let i = 1; i <= count; i++) {
    const position = array.indexOf('.') + 3 * i + i;
    if (position !== array.length) {
      array.splice(position, 0, ',');
    }
  }
  array = array.reverse();
  return array.join('');
}

interface DenominateType {
  input: string;
  denomination: number;
  decimals: number;
  showAllDecimals: boolean;
}

export default function denominate({
  input,
  denomination,
  decimals,
  showAllDecimals = false,
}: DenominateType): string {
  if (input === '...') {
    return input;
  }
  if (input === '' || input === '0' || input === undefined) {
    input = '0';
  }
  return format(input, denomination, decimals, showAllDecimals);
}
