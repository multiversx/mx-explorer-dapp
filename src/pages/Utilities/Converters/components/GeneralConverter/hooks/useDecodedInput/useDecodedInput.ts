import { useMemo } from 'react';

import { DecodeMethodEnum, getDecodedDataField } from 'lib';

import { decoders, hexDecoders } from '../../helpers';
import { DecodedChunkType, DecodedResultType, DecoderType } from '../../types';

const DATA_FIELD_SEPARATOR = '@';

const runDecoders = (
  value: string,
  availableDecoders: DecoderType[]
): DecodedResultType[] =>
  availableDecoders.reduce((results: DecodedResultType[], decoder) => {
    let result: string | undefined;

    try {
      result = decoder.decode(value);
    } catch {
      return results;
    }

    if (!result || result === value) {
      return results;
    }

    return [
      ...results,
      { identifier: decoder.identifier, label: decoder.label, result }
    ];
  }, []);

export const useDecodedInput = (value: string): DecodedChunkType[] =>
  useMemo(() => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return [];
    }

    const chunks = trimmedValue.split(DATA_FIELD_SEPARATOR);

    const leadingOffset = value.length - value.trimStart().length;

    if (chunks.length === 1) {
      return [
        {
          input: trimmedValue,
          isFunctionName: false,
          results: runDecoders(trimmedValue, decoders),
          start: leadingOffset,
          end: leadingOffset + trimmedValue.length
        }
      ];
    }

    let position = leadingOffset;

    return chunks
      .map((chunk, index) => {
        const start = position;
        position += chunk.length + DATA_FIELD_SEPARATOR.length;

        return {
          input: chunk,
          isFunctionName: index === 0,
          results: runDecoders(chunk, hexDecoders),
          start,
          end: start + chunk.length
        };
      })
      .filter(({ input }) => input !== '');
  }, [value]);
