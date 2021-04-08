import { denomination as configDenomination } from 'appConfig';

export default function nominate(input: string, customDenomination?: number) {
  const parts = input.toString().split('.');
  const denomination = customDenomination !== undefined ? customDenomination : configDenomination;

  if (parts[1]) {
    // remove trailing zeros
    while (parts[1].substring(parts[1].length - 1) === '0' && parts[1].length > 1) {
      parts[1] = parts[1].substring(0, parts[1].length - 1);
    }
  }

  let count = parts[1] ? denomination - parts[1].length : denomination;

  count = count < 0 ? 0 : count;

  let transformed = parts.join('') + '0'.repeat(count);

  // remove beginning zeros
  while (transformed.substring(0, 1) === '0' && transformed.length > 1) {
    transformed = transformed.substring(1);
  }

  return transformed;
}
