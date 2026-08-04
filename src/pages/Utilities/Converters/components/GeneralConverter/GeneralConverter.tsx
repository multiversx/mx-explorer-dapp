import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTimes } from 'icons/regular';

import { ConversionChunk } from './components';
import { useDecodedInput } from './hooks';
import { DecodedChunkType } from './types';

export const GeneralConverter = () => {
  const [value, setValue] = useState('');
  const chunks = useDecodedInput(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDataField = chunks.length > 1;

  const highlightChunk = ({ start, end }: DecodedChunkType) => {
    if (!isDataField || !inputRef.current) {
      return;
    }

    inputRef.current.setSelectionRange(start, end);
  };

  const clearHighlight = () => {
    if (!isDataField || !inputRef.current) {
      return;
    }

    inputRef.current.setSelectionRange(value.length, value.length);
  };

  return (
    <>
      <div className='input-group input-group-seamless overflow-hidden general-converter'>
        <textarea
          ref={inputRef}
          className='form-control general-converter-input general-textarea'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder='Convert any value'
          rows={2}
          autoComplete='off'
          spellCheck={false}
          data-testid='general-converter-input'
        />

        {value && (
          <button
            type='button'
            className='input-group-text'
            onClick={() => setValue('')}
            aria-label='Clear'
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {chunks.map((chunk, chunkIndex) => (
        <ConversionChunk
          key={`${chunkIndex}-${chunk.input}`}
          chunk={chunk}
          isDataField={isDataField}
          onHighlight={highlightChunk}
          onClearHighlight={clearHighlight}
        />
      ))}
    </>
  );
};
