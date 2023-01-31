import React from 'react';

import { faFileAlt, faLink } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';

import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import { CopyButton } from 'components';
import { ContractEntryType } from 'types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFiles = ({
  entries
}: {
  entries: ContractEntryType[];
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { hash, pathname } = useLocation();

  const formattedHash = hash.replace('#', '');

  const fullPath = `${window.location.protocol}//${window.location.hostname}${pathname}`;

  React.useEffect(() => {
    if (ref.current && ref.current !== null) {
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top - 86,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className='contract-files'>
      {entries
        .filter(({ path }) => path.endsWith('.rs') && !path.includes('/tests'))
        .map(({ path, content }, index) => {
          const base64Buffer = Buffer.from(content, 'base64');
          const codeString = base64Buffer.toString();

          const selectedFile = formattedHash === path;

          return (
            <div
              key={path}
              className='d-flex flex-column mb-3'
              id={path}
              {...(selectedFile ? { ref: ref } : {})}
            >
              <div className='d-flex flex-row flex-wrap gap-2 align-items-center mb-3 card card-sm bg-table-header px-3 py-2'>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className='me-1 text-primary'
                />
                <span className='text-neutral-400'>
                  {index + 1}/{entries.length}{' '}
                </span>
                <code>{path}</code>
              </div>
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
          );
        })}
    </div>
  );
};
