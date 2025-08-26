import { DecodedDisplayType, DecodeMethodEnum } from 'lib';
import {
  decodeByMethod,
  getDisplayValueAndValidationWarnings,
  getSmartDecodedParts
} from './helpers';

export interface DecodeForDisplayPropsType {
  input: string;
  decodeMethod: DecodeMethodEnum;
  identifier?: string;
}

export const getDecodedData = ({
  input,
  decodeMethod,
  identifier
}: DecodeForDisplayPropsType) => {
  const display: DecodedDisplayType = {
    displayValue: '',
    highlight: '',
    validationWarnings: []
  };

  if (!input.includes('@') && !input.includes('\n')) {
    display.displayValue = decodeByMethod(input, decodeMethod);

    return display;
  }

  if (input.includes('@')) {
    const parts = input.split('@');
    const decodedParts = getDisplayValueAndValidationWarnings({
      parts,
      identifier,
      decodeMethod,
      display
    });

    display.displayValue = decodedParts.join('@');
  }

  if (input.includes('\n')) {
    const parts = input.split('\n');
    const initialDecodedParts = parts.map((part: any) => {
      const base64Buffer = Buffer.from(part, 'base64');

      if (decodeMethod === DecodeMethodEnum.raw) {
        return part;
      }

      return decodeByMethod(base64Buffer.toString('hex'), decodeMethod);
    });

    const decodedParts =
      decodeMethod === DecodeMethodEnum.smart
        ? getSmartDecodedParts({
            parts,
            decodedParts: initialDecodedParts,
            identifier
          })
        : initialDecodedParts;

    display.displayValue = decodedParts.join('\n');
  }

  return display;
};
