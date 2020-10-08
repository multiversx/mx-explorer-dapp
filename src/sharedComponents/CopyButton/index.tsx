import * as React from 'react';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as CopyIcon } from './../../assets/img/copy-icon.svg';
import copyTextToClipboard from './helpers/copyToClipboard';
//import './copyButton.scss';

interface CopyButtonType {
  text: string;
  extraClasses?: string;
}

const CopyButton = ({ text, extraClasses }: CopyButtonType) => {
  const [copyResult, setCopyResut] = React.useState({
    default: true,
    success: false,
  });
  const ref = React.useRef(null);

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces),
    });

    setTimeout(() => {
      if (ref !== null) {
        setCopyResut({
          default: true,
          success: false,
        });
      }
    }, 1000);
  };

  return (
    <button
      className={`btn copy-btn text-primary p-0 pl-2 ${extraClasses ? extraClasses : ''}`}
      onClick={handleCopyToClipboard}
      ref={ref}
    >
      {copyResult.default || !copyResult.success ? (
        <CopyIcon className="copy-icon" />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="check-icon" />
      )}
    </button>
  );
};

export default CopyButton;
