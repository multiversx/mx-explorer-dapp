import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClone } from 'icons/regular';

import { copyTextToClipboard } from './helpers/copyToClipboard';

interface CopyButtonType {
  text: string;
  className?: string;
  icon?: any;
}

export const CopyButton = ({ text, icon, className = '' }: CopyButtonType) => {
  const [copyResult, setCopyResut] = useState({
    default: true,
    success: false
  });
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces)
    });

    resetTimeoutRef.current = setTimeout(() => {
      setCopyResut({
        default: true,
        success: false
      });
    }, 1000);
  };

  return (
    <a
      href='/#'
      onClick={handleCopyToClipboard}
      className={`side-action ${className}`}
      aria-label='Copy'
    >
      {copyResult.default || !copyResult.success ? (
        <FontAwesomeIcon icon={icon ? icon : faClone} />
      ) : (
        <FontAwesomeIcon icon={faCheck} className='text-primary' />
      )}
    </a>
  );
};
