import * as React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
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
  const [loaded, setLoaded] = React.useState(false);
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
      delay={{ show: 250, hide: 400 }}
      onExited={() => {
        setLoaded(false);
      }}
      overlay={(props) => (
        <Tooltip id='nft-tooltip' {...props}>
          <div style={{ width: '90px' }}>
            {!loaded && (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                size='2x'
                className='text-white fa-spin fast-spin'
              />
            )}
            <img
              src={thumbnail}
              alt=' '
              height={90}
              onLoad={() => {
                setLoaded(true);
              }}
            />
          </div>
        </Tooltip>
      )}
    >
      {children}
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
                  <Thumbnail link={found ? '' : link} token={token} index={i}>
                    <Anchorme
                      linkComponent={ModalLink}
                      target='_blank'
                      rel='noreferrer noopener'
                    >
                      {found ? stringWithLinks : link}
                    </Anchorme>
                  </Thumbnail>
                ) : (
                  <span className='text-break'>
                    {found ? (
                      <Anchorme
                        linkComponent={ModalLink}
                        target='_blank'
                        rel='noreferrer noopener'
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