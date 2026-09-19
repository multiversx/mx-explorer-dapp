import BigNumber from 'bignumber.js';

import { isHash } from 'helpers';
import {
  Address,
  addressIsValid,
  DecodeMethodEnum,
  formatAmount,
  getDecodedDataField,
  isUtf8,
  parseAmount,
  stringIsFloat,
  stringIsInteger
} from 'lib';

import {
  isBase64,
  isEvenHexString,
  isHexString,
  padHex
} from '../../../helpers';
import { DecoderEnum, DecoderType } from '../types';

const hexToUtf8 = (value: string) => {
  const decoded = Buffer.from(value, 'hex').toString('utf8');

  return isUtf8(decoded) ? decoded : undefined;
};

const base64ToUtf8 = (value: string) => {
  const decoded = Buffer.from(value, 'base64').toString('utf8');

  return isUtf8(decoded) ? decoded : undefined;
};

const hexToDecimal = (value: string) =>
  isHexString(value)
    ? new BigNumber(value.toLowerCase(), 16).toFixed()
    : undefined;

const base64ToHex = (value: string) =>
  isBase64(value) ? Buffer.from(value, 'base64').toString('hex') : undefined;

export const decoders: DecoderType[] = [
  {
    identifier: DecoderEnum.bech32ToHex,
    label: 'Bech32 → Hex',
    decode: (value) =>
      addressIsValid(value) ? padHex(new Address(value).toHex()) : undefined
  },
  {
    identifier: DecoderEnum.hexToBech32,
    label: 'Hex → Bech32',
    decode: (value) =>
      isHash(value) ? Address.newFromHex(value).toBech32() : undefined
  },
  {
    identifier: DecoderEnum.decimalToHex,
    label: 'Decimal → Hex',
    decode: (value) =>
      stringIsInteger(value)
        ? padHex(new BigNumber(value, 10).toString(16))
        : undefined
  },
  {
    identifier: DecoderEnum.hexToDecimal,
    label: 'Hex → Decimal',
    decode: hexToDecimal
  },
  {
    identifier: DecoderEnum.decimalToBase64,
    label: 'Decimal → Base64',
    decode: (value) =>
      stringIsInteger(value)
        ? Buffer.from(
            padHex(new BigNumber(value).toString(16)),
            'hex'
          ).toString('base64')
        : undefined
  },
  {
    identifier: DecoderEnum.base64ToDecimal,
    label: 'Base64 → Decimal',
    decode: (value) => {
      const hex = base64ToHex(value);

      return hex ? hexToDecimal(hex) : undefined;
    }
  },
  {
    identifier: DecoderEnum.amountToDenominated,
    label: 'Amount → Denominated',
    decode: (value) => (stringIsFloat(value) ? parseAmount(value) : undefined)
  },
  {
    identifier: DecoderEnum.denominatedToAmount,
    label: 'Denominated → Amount',
    decode: (value) =>
      stringIsInteger(value)
        ? formatAmount({ input: value, showLastNonZeroDecimal: true })
        : undefined
  },
  {
    identifier: DecoderEnum.stringToHex,
    label: 'String → Hex',
    decode: (value) => Buffer.from(value, 'utf8').toString('hex')
  },
  {
    identifier: DecoderEnum.hexToString,
    label: 'Hex → String',
    decode: (value) => (isEvenHexString(value) ? hexToUtf8(value) : undefined)
  },
  {
    identifier: DecoderEnum.stringToBase64,
    label: 'String → Base64',
    decode: (value) => Buffer.from(value, 'utf8').toString('base64')
  },
  {
    identifier: DecoderEnum.base64ToString,
    label: 'Base64 → String',
    decode: (value) => (isBase64(value) ? base64ToUtf8(value) : undefined)
  },
  {
    identifier: DecoderEnum.hexToBase64,
    label: 'Hex → Base64',
    decode: (value) =>
      isEvenHexString(value)
        ? Buffer.from(value, 'hex').toString('base64')
        : undefined
  },
  {
    identifier: DecoderEnum.base64ToHex,
    label: 'Base64 → Hex',
    decode: (value) => {
      const hex = base64ToHex(value);

      return hex ? padHex(hex) : undefined;
    }
  },
  {
    identifier: DecoderEnum.smartTx,
    label: 'Smart',
    decode: (value) => {
      const { displayValue } = getDecodedDataField({
        data: value,
        decodeMethod: DecodeMethodEnum.smart
      });

      return displayValue;
    }
  }
];

export const hexDecoderIdentifiers = [
  DecoderEnum.hexToBech32,
  DecoderEnum.hexToString,
  DecoderEnum.hexToDecimal,
  DecoderEnum.hexToBase64
];

export const hexDecoders = hexDecoderIdentifiers.map(
  (identifier) =>
    decoders.find((decoder) => decoder.identifier === identifier) as DecoderType
);
