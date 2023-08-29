import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import { CopyButton, CollapsibleArrows } from 'components';
import { faFileAlt, faLink } from 'icons/solid';
import { ContractEntryType } from 'types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFile = ({
  entry,
  index,
  totalEntries,
  isOpen = false
}: {
  entry: ContractEntryType;
  index: number;
  totalEntries: number;
  isOpen?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(isOpen);

  const { pathname } = useLocation();
  const fullPath = `${window.location.protocol}//${window.location.hostname}${pathname}`;

  const { content, path } = entry;

  const base64Buffer = Buffer.from(content, 'base64');
  const codeString = base64Buffer.toString();

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        aria-controls={`${path}-${index}`}
        aria-expanded={open}
        className='d-flex flex-row flex-wrap gap-2 align-items-center mb-3 card card-sm bg-table-header px-3 py-2 cursor-pointer'
      >
        <FontAwesomeIcon icon={faFileAlt} className='me-1 text-primary' />
        <span className='text-neutral-400'>
          {index + 1}/{totalEntries}{' '}
        </span>
        <code>{path}</code>
        <CollapsibleArrows expanded={open} />
      </div>
      <Collapse in={open}>
        <div id={`${path}-${index}`}>
          <div className='code-block'>
            <div className='button-holder'>
              <CopyButton text={codeString} className='copy-button' />
              <CopyButton
                icon={faLink}
                text={`${fullPath}#${path}`}
                className='copy-link-button'
              />
            </div>
            <SyntaxHighlighter
              language='rust'
              style={androidstudio}
              showLineNumbers
              wrapLongLines
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        </div>
      </Collapse>
    </>
  );
};
