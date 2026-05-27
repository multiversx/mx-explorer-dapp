import BigNumber from 'bignumber.js';

import {
  Address,
  addressIsValid,
  formatAmount,
  parseAmount,
  stringIsFloat,
  stringIsInteger
} from 'lib';

import type { CategoryType } from './types';

export const useCategories = () => {
  const categories: CategoryType[] = [
    {
      name: 'Addresses',
      identifier: 'addresses',
      converters: [
        {
          title: 'Convert a bech32 address to a hexadecimal address',
          label: 'Bech32 address',
          identifier: 'bech32-to-hexadecimal',
          compute: (address: string) => {
            const hex = new Address(address).toHex();

            return hex.length % 2 ? `0${hex}` : hex;
          },
          validate: {
            required: 'Bech32 address required.',
            test: {
              error: 'Value must be a bech32 address.',
              callback: (value: string | undefined) =>
                value ? addressIsValid(value) : false
            }
          }
        },
        {
          title: 'Convert a hexadecimal address to a bech32 address',
          label: 'Hexadecimal address',
          identifier: 'hexadecimal-to-bech32',
          compute: (address: string) => Address.newFromHex(address).toBech32(),
          validate: {
            required: 'Hexadecimal address required.',
            test: {
              error: 'Value must be a hexadecimal address.',
              callback: (value: string | undefined) => {
                if (!value) {
                  return false;
                }

                try {
                  Address.newFromHex(value);
                  return true;
                } catch {
                  return false;
                }
              }
            }
          }
        }
      ]
    },
    {
      name: 'Numeric',
      identifier: 'numeric',
      converters: [
        {
          title: 'Convert a decimal to a hexadecimal',
          label: 'Decimal value',
          identifier: 'decimal-to-hexadecimal',
          compute: (value: string) => {
            const hex = BigNumber(value, 10).toString(16);

            return hex.length % 2 ? `0${hex}` : hex;
          },
          validate: {
            required: 'Decimal required.',
            test: {
              error: 'Value must be a decimal.',
              callback: (value: string | undefined) =>
                value ? stringIsInteger(value) : false
            }
          }
        },
        {
          title: 'Convert a hexadecimal to a decimal',
          label: 'Hexadecimal value',
          identifier: 'hexadecimal-to-decimal',
          compute: (value: string) => BigNumber(value, 16).toString(10),
          validate: {
            required: 'Hexadecimal required.',
            test: {
              error: 'Value must be a hexadecimal.',
              callback: (value: string | undefined) =>
                value ? /^[0-9a-fA-F]+$/.test(value) : false
            }
          }
        },
        {
          title: 'Convert a decimal to base64',
          label: 'Decimal value',
          identifier: 'decimal-to-base64',
          compute: (value: string) => {
            const hex = new BigNumber(value).toString(16);
            const paddedHex = hex.length % 2 ? `0${hex}` : hex;

            return Buffer.from(paddedHex, 'hex').toString('base64');
          },
          validate: {
            required: 'Decimal required.',
            test: {
              error: 'Value must be a decimal.',
              callback: (value: string | undefined) =>
                value ? stringIsInteger(value) || stringIsFloat(value) : false
            }
          }
        },
        {
          title: 'Convert base64 to a decimal',
          label: 'Base64 value',
          identifier: 'base64-to-decimal',
          compute: (value: string) => {
            const hex = Buffer.from(value, 'base64').toString('hex');
            const paddedHex = hex.length % 2 ? `0${hex}` : hex;

            return BigNumber(paddedHex, 16).toString(10);
          },
          validate: {
            required: 'Base64 required.',
            test: {
              error: 'Value must be a base64 input.',
              callback: (value: string | undefined) => {
                if (!value) return false;

                try {
                  atob(value);

                  return true;
                } catch {
                  return false;
                }
              }
            }
          }
        }
      ]
    },
    {
      name: 'Amounts Formatting',
      identifier: 'amounts-formatting',
      converters: [
        {
          title: 'Parse amount (denominate)',
          label: 'Numeric value',
          identifier: 'decimal-to-integer',
          compute: parseAmount,
          validate: {
            required: 'Numeric value required.',
            test: {
              error: 'Value must be an integer.',
              callback: (value: string | undefined) =>
                value ? stringIsInteger(value) || stringIsFloat(value) : false
            }
          }
        },
        {
          title: 'Format amount (nominate)',
          label: 'Denominated value',
          identifier: 'integer-to-decimal',
          compute: (value: string) =>
            formatAmount({
              input: value,
              showLastNonZeroDecimal: true
            }),
          validate: {
            required: 'Denominated value required.',
            test: {
              error: 'Value must be an integer.',
              callback: (value: string | undefined) =>
                value ? stringIsInteger(value) : false
            }
          }
        }
      ]
    },
    {
      name: 'String Converters',
      identifier: 'string-converters',
      converters: [
        {
          title: 'Convert a string to a hexadecimal encoded string',
          label: 'String value',
          identifier: 'string-to-hexadecimal',
          compute: (value: string) =>
            Buffer.from(value, 'ascii').toString('hex'),
          validate: {
            required: 'String required.'
          }
        },
        {
          title: 'Convert a hexadecimal encoded string to a string',
          label: 'Hexadecimal value',
          identifier: 'hexadecimal-to-string',
          compute: (value: string) =>
            Buffer.from(value, 'hex').toString('utf8'),
          validate: {
            required: 'Hexadecimal required.',
            test: {
              error: 'Value must be a hexadecimal.',
              callback: (value: string | undefined) =>
                value ? /^[0-9a-fA-F]+$/.test(value) : false
            }
          }
        },
        {
          title: 'Convert a string to a base64 encoded string',
          label: 'String value',
          identifier: 'string-to-base64',
          compute: (value: string) =>
            Buffer.from(value, 'ascii').toString('base64'),
          validate: {
            required: 'String required.'
          }
        },
        {
          title: 'Convert a base64 encoded string to a string',
          label: 'Base64 value',
          identifier: 'base64-to-string',
          compute: (value: string) =>
            Buffer.from(value, 'base64').toString('ascii'),
          validate: {
            required: 'Base64 value required.',
            test: {
              error: 'Value must be a base64 value.',
              callback: (value: string | undefined) => {
                if (!value) return false;

                try {
                  atob(value);

                  return true;
                } catch {
                  return false;
                }
              }
            }
          }
        },
        {
          title: 'Convert a hexadecimal encoded string to base64',
          label: 'Hexadecimal value',
          identifier: 'hexadecimal-to-base64',
          compute: (value: string) =>
            Buffer.from(value, 'hex').toString('base64'),
          validate: {
            required: 'Hexadecimal required.',
            test: {
              error: 'Value must be a hexadecimal.',
              callback: (value: string | undefined) =>
                value ? /^[0-9a-fA-F]+$/.test(value) : false
            }
          }
        },
        {
          title:
            'Convert a base64 encoded string to hexadecimal encoded string.',
          label: 'Base64 value',
          identifier: 'base64-to-hexadecimal',
          compute: (value: string) => {
            const hex = Buffer.from(value, 'base64').toString('hex');

            return hex.length % 2 ? `0${hex}` : hex;
          },
          validate: {
            required: 'Base64 value required.',
            test: {
              error: 'Value must be a base64 input.',
              callback: (value: string | undefined) => {
                if (!value) return false;

                try {
                  atob(value);

                  return true;
                } catch {
                  return false;
                }
              }
            }
          }
        }
      ]
    }
  ];

  return { categories };
};
