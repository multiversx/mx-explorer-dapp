import { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from 'react-bootstrap';

import { CopyButton, NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { useGetSearchQueryType } from 'hooks/search/useGetSearchQueryType';
import {
  faChevronRight,
  faChevronUp,
  faSearch,
  faArrowUpRightFromSquare
} from 'icons/regular';

import { DecodedResultType } from '../../types';

const ConversionResult = ({ label, result }: DecodedResultType) => {
  const getSearchQueryType = useGetSearchQueryType();
  const { isProbableSearch } = getSearchQueryType(result);

  return (
    <div className='conversion-result'>
      <div className='text-neutral-400 small mb-1'>{label}</div>

      <div className='d-flex align-items-center gap-2 text-break'>
        <code>{result}</code>
        <CopyButton text={result} />
        {isProbableSearch && (
          <>
            <NetworkLink
              to={urlBuilder.search(result)}
              className='side-action ms-0'
            >
              <FontAwesomeIcon icon={faSearch} />
            </NetworkLink>
            <NetworkLink
              to={urlBuilder.search(result)}
              className='side-action mx-0'
              target='_blank'
              rel='noreferrer nofollow noopener'
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </NetworkLink>
          </>
        )}
      </div>
    </div>
  );
};

export interface ConversionResultsType {
  results: DecodedResultType[];
  expanded: boolean;
  onToggle: () => void;
}

export const ConversionResults = ({
  results,
  expanded,
  onToggle
}: ConversionResultsType) => {
  const [firstResult, ...remainingResults] = results;
  const hasRemainingResults = remainingResults.length > 0;

  const toggleCollapseClick = (event: MouseEvent) => {
    // The whole card toggles too, so let it handle this click only once.
    event.stopPropagation();
    onToggle();
  };

  return (
    <div className='conversion-results'>
      <div className='d-flex'>
        {hasRemainingResults && (
          <button
            type='button'
            className='conversion-results-toggle text-neutral-400'
            onClick={toggleCollapseClick}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? 'Show fewer conversions'
                : `Show ${remainingResults.length} more ${
                    remainingResults.length === 1 ? 'conversion' : 'conversions'
                  }`
            }
            data-testid='general-converter-toggle'
          >
            <FontAwesomeIcon
              icon={expanded ? faChevronUp : faChevronRight}
              className='text-primary'
              size='lg'
            />
          </button>
        )}

        <ConversionResult {...firstResult} />
      </div>

      {hasRemainingResults && (
        <Collapse in={expanded}>
          <div>
            <div className='d-flex flex-column gap-3 pt-3'>
              {remainingResults.map((result) => (
                <div className='d-flex' key={result.identifier}>
                  <span className='conversion-results-toggle' />

                  <ConversionResult {...result} />
                </div>
              ))}
            </div>
          </div>
        </Collapse>
      )}
    </div>
  );
};
