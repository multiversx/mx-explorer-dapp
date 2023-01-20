import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/pro-regular-svg-icons/faClone';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import copyTextToClipboard from './helpers/copyToClipboard';

interface CopyButtonType {
  text: string;
  className?: string;
  icon?: any;
}

const CopyButton = ({ text, icon, className = '' }: CopyButtonType) => {
  const [copyResult, setCopyResut] = React.useState({
    default: true,
    success: false,
  });

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces),
    });

    setTimeout(() => {
      setCopyResut({
        default: true,
        success: false,
      });
    }, 1000);
  };

  return (
    <a href="/#" onClick={handleCopyToClipboard} className={`side-action ${className}`}>
      {copyResult.default || !copyResult.success ? (
        <FontAwesomeIcon icon={icon ? icon : faClone} />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-primary" />
      )}
    </a>
  );
};

export default CopyButton;
