import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { ContractEntryType } from 'types';

import { ContractFile } from './ContractFile';

export const ContractFiles = ({
  entries
}: {
  entries: ContractEntryType[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  const formattedHash = hash.replace('#', '');

  useEffect(() => {
    setTimeout(() => {
      if (formattedHash && ref.current && ref.current !== null) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top - 86,
          behavior: 'smooth'
        });
      }
    }, 200);
  }, [formattedHash]);

  const filteredEntries = entries.filter(
    ({ path, isTestFile }) =>
      path.endsWith('.rs') && !path.includes('/tests') && !isTestFile
  );

  return (
    <div className='contract-files'>
      {filteredEntries.map((entry, index) => {
        const selectedFile = formattedHash === entry.path;
        return (
          <div
            key={entry.path}
            className='d-flex flex-column mb-3'
            id={entry.path}
            {...(selectedFile ? { ref: ref } : {})}
          >
            <ContractFile
              entry={entry}
              index={index}
              totalEntries={filteredEntries.length}
              isOpen={index === 0 || selectedFile}
            />
          </div>
        );
      })}
    </div>
  );
};
