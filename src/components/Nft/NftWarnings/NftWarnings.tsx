import { MouseEvent } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Overlay } from 'components';
import { NftType, NftTypeEnum, WithClassnameType } from 'types';

interface NftWarningsPropsType extends WithClassnameType {
  nft: NftType;
  isNsfwHidden: boolean;
  onNsfwVisibilityToggle: (event: MouseEvent<HTMLDivElement>) => void;
}

export const NftWarnings = ({
  nft,
  isNsfwHidden,
  onNsfwVisibilityToggle,
  className
}: NftWarningsPropsType) => {
  const isSft = nft.type === NftTypeEnum.SemiFungibleESDT;
  const typeLabel = isSft ? 'SFT' : 'NFT';
  const nsfwWarningMessage = `This ${typeLabel} has been flagged as not safe for work`;

  const handleNsfwVisibilityToggle = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (nft.scamInfo) {
      event.preventDefault();
      return true;
    }
    onNsfwVisibilityToggle(event);
  };

  const handlePropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    return true;
  };

  if (!nft.scamInfo && !nft.isNsfw) {
    return null;
  }

  return (
    <div
      className={classNames('nft-warnings', className)}
      onClick={handleNsfwVisibilityToggle}
    >
      {Boolean(nft.isNsfw) && (
        <div
          className={classNames('nft-warning', {
            'cursor-pointer': nft.scamInfo
          })}
        >
          <Overlay
            className='nft-warning-tooltip'
            title={
              Boolean(nft.scamInfo)
                ? `${nsfwWarningMessage}.`
                : `${nsfwWarningMessage}. You can manually toggle it back on.`
            }
          >
            <div className='badge badge-outline badge-outline-orange nft-warning-badge'>
              <div className='nft-warning-badge-wrapper'>
                <div
                  className={classNames('nft-warning-badge-text', {
                    enabled: !isNsfwHidden
                  })}
                >
                  NSFW
                </div>

                {!nft.scamInfo && (
                  <div className='nft-warning-badge-toggle'>
                    <FontAwesomeIcon
                      icon={isNsfwHidden ? faEyeSlash : faEye}
                      className={classNames('nft-warning-badge-toggle-icon', {
                        enabled: !isNsfwHidden
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
          </Overlay>
        </div>
      )}

      {Boolean(nft.scamInfo) && (
        <div className='nft-warning' onClick={handlePropagation}>
          <Overlay
            className='nft-warning-tooltip'
            title={`This ${typeLabel} has been flagged as scam.`}
          >
            <div className='badge badge-outline badge-outline-orange nft-warning-badge'>
              <div className='nft-warning-badge-wrapper'>
                <div className='nft-warning-badge-text'>SCAM</div>
              </div>
            </div>
          </Overlay>
        </div>
      )}
    </div>
  );
};
