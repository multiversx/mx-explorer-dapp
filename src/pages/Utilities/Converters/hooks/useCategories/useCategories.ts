import { useMemo } from 'react';
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
import { isHexString, padHex } from '../../helpers';

export const useCategories = () => {
  const categories: CategoryType[] = useMemo(
    () => [
      {
        name: 'Addresses',
        identifier: 'addresses',
        converters: [
          {
            name: 'Bech32 → Hexadecimal',
            title: 'Convert a bech32 address to a hexadecimal address',
            label: 'Bech32 address',
            identifier: 'bech32-to-hexadecimal',
            compute: (address: string) => {
              return padHex(new Address(address).toHex());
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
            name: 'Hexadecimal → Bech32',
            title: 'Convert a hexadecimal address to a bech32 address',
            label: 'Hexadecimal address',
            identifier: 'hexadecimal-to-bech32',
            compute: (address: string) =>
              Address.newFromHex(address).toBech32(),
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
            name: 'Decimal → Hexadecimal',
            title: 'Convert a decimal to a hexadecimal',
            label: 'Decimal value',
            identifier: 'decimal-to-hexadecimal',
            compute: (value: string) => {
              return padHex(BigNumber(value, 10).toString(16));
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
            name: 'Hexadecimal → Decimal',
            title: 'Convert a hexadecimal to a decimal',
            label: 'Hexadecimal value',
            identifier: 'hexadecimal-to-decimal',
            compute: (value: string) => BigNumber(value, 16).toString(10),
            validate: {
              required: 'Hexadecimal required.',
              test: {
                error: 'Value must be a hexadecimal.',
                callback: (value: string | undefined) =>
                  value ? isHexString(value) : false
              }
            }
          },
          {
            name: 'Decimal → Base64',
            title: 'Convert a decimal to base64',
            label: 'Decimal value',
            identifier: 'decimal-to-base64',
            compute: (value: string) => {
              return Buffer.from(
                padHex(new BigNumber(value).toString(16)),
                'hex'
              ).toString('base64');
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
            name: 'Base64 → Decimal',
            title: 'Convert base64 to a decimal',
            label: 'Base64 value',
            identifier: 'base64-to-decimal',
            compute: (value: string) => {
              const paddedHex = padHex(
                Buffer.from(value, 'base64').toString('hex')
              );

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
            name: 'Parse amount',
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
            name: 'Format amount',
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
            name: 'String → Hexadecimal',
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
            name: 'Hexadecimal → String',
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
                  value ? isHexString(value) : false
              }
            }
          },
          {
            name: 'String → Base64',
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
            name: 'Base64 → String',
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
            name: 'Hexadecimal → Base64',
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
                  value ? isHexString(value) : false
              }
            }
          },
          {
            name: 'Base64 → Hexadecimal',
            title:
              'Convert a base64 encoded string to hexadecimal encoded string.',
            label: 'Base64 value',
            identifier: 'base64-to-hexadecimal',
            compute: (value: string) => {
              return padHex(Buffer.from(value, 'base64').toString('hex'));
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
    ],
    []
  );

  return { categories };
};
