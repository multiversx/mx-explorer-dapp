import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { types } from 'helpers';

const Thumbnail = ({ token, children }: { token: types.NftType; children: any }) => {
  const [loaded, setLoaded] = React.useState(false);
  return token.thumbnailUrl ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      onExited={() => {
        setLoaded(false);
      }}
      overlay={(props) => (
        <Tooltip id="nft-tooltip" {...props}>
          {!loaded && (
            <FontAwesomeIcon
              icon={faSpinnerThird}
              size="2x"
              className="text-white fa-spin fast-spin"
            />
          )}
          <img
            src={token.thumbnailUrl}
            alt={token.name}
            height={90}
            onLoad={() => {
              setLoaded(true);
            }}
          />
        </Tooltip>
      )}
    >
      {children}
    </OverlayTrigger>
  ) : (
    <>{children}</>
  );
};

const NftPreview = ({ token }: { token: types.NftType }) => {
  return token.uris ? (
    <div className="nft-details d-flex flex-column text-left">
      <ul className="list-unstyled mb-0">
        {token.uris.map((uri, i) => {
          if (uri !== null && uri !== undefined) {
            const link = Buffer.from(String(uri), 'base64').toString();
            return (
              <li key={i}>
                <Thumbnail token={token}>
                  {link.startsWith('http') ? (
                    <a
                      href={link}
                      {...{ target: '_blank' }}
                      data-testid={`${token.identifier}-link-${i}`}
                      className="text-break"
                    >
                      {link}
                    </a>
                  ) : (
                    <span className="text-break">{link}</span>
                  )}
                </Thumbnail>
              </li>
            );
          } else return null;
        })}
      </ul>
    </div>
  ) : null;
};

export default NftPreview;
