import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { faSpinnerThird } from 'icons/regular';
import { NftType } from 'types';

export const NftThumbnail = ({
  token,
  link,
  index,
  children
}: {
  token: NftType;
  link: string;
  index: number;
  children: any;
}) => {
  let thumbnail = '';
  const [loaded, setLoaded] = useState(false);
  if (token.media && token.media.length && link) {
    const found = token.media.find(
      (mediaEntry) => mediaEntry.originalUrl === link
    );

    if (found) {
      thumbnail = found.thumbnailUrl;
    } else {
      thumbnail =
        token.media[index] && token.media[index].thumbnailUrl
          ? token.media[index].thumbnailUrl
          : '';
    }
  }

  if (thumbnail) {
    return (
      <OverlayTrigger
        placement='top'
        delay={{ show: 150, hide: 300 }}
        onExited={() => {
          setLoaded(false);
        }}
        overlay={(props: any) => (
          <Tooltip
            {...props}
            className='nft-tooltip'
            show={props.show.toString()}
          >
            <div className='preview-wrapper'>
              {!loaded && (
                <FontAwesomeIcon
                  icon={faSpinnerThird}
                  size='2x'
                  className='image-loader text-white fa-spin fast-spin'
                />
              )}
              <img
                src={thumbnail}
                alt='Preview'
                onLoad={() => {
                  setLoaded(true);
                }}
              />
            </div>
          </Tooltip>
        )}
      >
        <span>{children}</span>
      </OverlayTrigger>
    );
  }

  return <>{children}</>;
};
