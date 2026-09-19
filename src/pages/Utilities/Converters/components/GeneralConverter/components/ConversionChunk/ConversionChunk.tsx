import { useState } from 'react';

import { DecodedChunkType } from '../../types';
import { ConversionResults } from '../ConversionResults';

export interface ConversionChunkType {
  chunk: DecodedChunkType;
  isDataField: boolean;
  onHighlight: (chunk: DecodedChunkType) => void;
  onClearHighlight: () => void;
}

export const ConversionChunk = ({
  chunk,
  isDataField,
  onHighlight,
  onClearHighlight
}: ConversionChunkType) => {
  const [expanded, setExpanded] = useState(false);

  const isExpandable = chunk.results.length > 1;

  const toggleExpanded = () => {
    setExpanded((expanded) => !expanded);
  };

  const onCardClick = () => {
    if (!isExpandable) {
      return;
    }

    // Selecting a value inside the card ends in a click. Toggling then would
    // yank the text the user was trying to read out from under them.
    if (window.getSelection()?.toString()) {
      return;
    }

    toggleExpanded();
  };

  return (
    <div
      className={`card mt-3 ${isDataField ? 'conversion-chunk' : ''} ${
        isExpandable ? 'conversion-chunk-expandable' : ''
      }`}
      onMouseEnter={() => onHighlight(chunk)}
      onMouseLeave={onClearHighlight}
      onClick={onCardClick}
      data-testid='general-converter-chunk'
    >
      <div className='card-header'>
        <h6 className='m-0 text-break'>
          {chunk.isFunctionName ? (
            `Function: ${chunk.input}`
          ) : (
            <>
              Possible conversions for <code>{chunk.input}</code>
            </>
          )}
        </h6>
      </div>

      {chunk.results.length > 0 && (
        <div className='card-body'>
          <ConversionResults
            results={chunk.results}
            expanded={expanded}
            onToggle={toggleExpanded}
          />
        </div>
      )}

      {chunk.results.length === 0 && !chunk.isFunctionName && (
        <div className='card-body text-neutral-400'>No known conversions.</div>
      )}
    </div>
  );
};
