import React, { useState } from 'react';
import { faSpinnerThird } from 'icons/regular';
import { faCaretRight } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchorme } from 'react-anchorme';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { ModalLink } from 'components';
import { useScamFlag } from 'hooks';
import { NftType } from 'types';

export const Thumbnail = ({
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

  return thumbnail ? (
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
              alt=' '
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
  ) : (
    <>{children}</>
  );
};

export const NftPreview = ({ token }: { token: NftType }) => {
  const scamFlag = useScamFlag();

  return token.uris ? (
    <div className='nft-details d-flex flex-column text-start'>
      <ul className='list-unstyled mb-0'>
        {token.uris.map((uri, i) => {
          if (uri !== null && uri !== undefined) {
            const link = Buffer.from(String(uri), 'base64').toString();
            const { stringWithLinks, found } = scamFlag(link, token.scamInfo);

            return (
              <li key={i}>
                <FontAwesomeIcon
                  icon={faCaretRight}
                  size='xs'
                  className='text-neutral-400 me-2'
                />
                {link.startsWith(
                  'https://ipfs.io/ipfs/'
                ) /* && token.isWhitelistedStorage === true */ ? (
                  <ModalLink
                    href={found ? stringWithLinks : link}
                    target='_blank'
                    rel='noreferrer nofollow noopener'
                  >
                    <Thumbnail link={found ? '' : link} token={token} index={i}>
                      {found ? stringWithLinks : link}
                    </Thumbnail>
                  </ModalLink>
                ) : (
                  <span className='text-break'>
                    {found ? (
                      <Anchorme
                        linkComponent={ModalLink}
                        target='_blank'
                        rel='noreferrer nofollow noopener'
                      >
                        {stringWithLinks}
                      </Anchorme>
                    ) : (
                      <Thumbnail link={link} token={token} index={i}>
                        <span>{link}</span>
                      </Thumbnail>
                    )}
                  </span>
                )}
              </li>
            );
          } else return null;
        })}
      </ul>
      {/* {token.isWhitelistedStorage === false && (
        <div className="d-flex ms-2 text-break-all ps-1">
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-neutral-400"
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className="text-danger ms-1">storage not whitelisted</small>
        </div>
      )} */}
    </div>
  ) : null;
};
