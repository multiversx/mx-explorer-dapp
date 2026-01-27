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
    onNsfwVisibilityToggle(event);
  };

  if (!nft.scamInfo && !nft.isNsfw) {
    return null;
  }

  return (
    <div
      className={classNames('nft-warnings', className)}
      onClick={(event) => event.stopPropagation()}
    >
      {Boolean(nft.isNsfw) && (
        <div className='nft-warning'>
          <Overlay
            className='nft-warning-tooltip'
            title={
              Boolean(nft.scamInfo)
                ? `${nsfwWarningMessage}.`
                : `${nsfwWarningMessage}. You can manually toggle it back on.`
            }
          >
            <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
              <div className='nft-warning-badge-wrapper'>
                <div
                  className={classNames('nft-warning-badge-text', {
                    enabled: !isNsfwHidden
                  })}
                >
                  Nsfw
                </div>

                {!nft.scamInfo && (
                  <div
                    className='nft-warning-badge-toggle'
                    onClick={handleNsfwVisibilityToggle}
                  >
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
        <div className='nft-warning'>
          <Overlay
            className='nft-warning-tooltip'
            title={`This ${typeLabel} has been flagged as scam! Sending is unavailable.`}
          >
            <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit nft-warning-badge'>
              <div className='nft-warning-badge-wrapper'>
                <div className='nft-warning-badge-text'>Scam</div>
              </div>
            </div>
          </Overlay>
        </div>
      )}
    </div>
  );
};
