import React from 'react';

import { faFileAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import { ContractEntryType } from 'types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFiles = ({
  entries
}: {
  entries: ContractEntryType[];
}) => {
  return (
    <div className='contract-files'>
      {entries.map(({ path, content }, index) => {
        const base64Buffer = Buffer.from(content, 'base64');
        const codeString = base64Buffer.toString();

        return (
          <div key={path} className='d-flex flex-column mb-3'>
            <div className='d-flex flex-row flex-wrap gap-2 align-items-center mb-3 card card-sm bg-table-header px-3 py-2'>
              <FontAwesomeIcon icon={faFileAlt} className='me-1 text-primary' />
              <span className='text-neutral-400'>
                {index + 1}/{entries.length}{' '}
              </span>
              {path}
            </div>
            <div className='code-block'>
              <SyntaxHighlighter language='rust' style={androidstudio}>
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      })}
    </div>
  );
};
