import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchorme } from 'react-anchorme';

import { ModalLink } from 'components';
import { useScamFlag } from 'hooks';
import { faCaretRight } from 'icons/solid';
import { NftType } from 'types';
import { NftThumbnail } from './NftThumbnail';

export const NftPreview = ({ token }: { token: NftType }) => {
  const scamFlag = useScamFlag();

  if (token.uris) {
    return (
      <div className='nft-details d-flex flex-column text-start'>
        <ul className='list-unstyled mb-0'>
          {token.uris.map((uri, i) => {
            if (!uri) {
              return null;
            }

            const link = Buffer.from(String(uri), 'base64').toString();
            const { stringWithLinks, found } = scamFlag(link, token.scamInfo);

            return (
              <li key={i}>
                <FontAwesomeIcon
                  icon={faCaretRight}
                  size='xs'
                  className='text-neutral-400 me-2'
                />
                {link.startsWith('https://ipfs.io/ipfs/') ? (
                  <ModalLink
                    href={found ? stringWithLinks : link}
                    target='_blank'
                    rel='noreferrer nofollow noopener'
                    className='text-break-all'
                  >
                    <NftThumbnail
                      link={found ? '' : link}
                      token={token}
                      index={i}
                    >
                      {found ? stringWithLinks : link}
                    </NftThumbnail>
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
                      <NftThumbnail link={link} token={token} index={i}>
                        <span>{link}</span>
                      </NftThumbnail>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return null;
};
