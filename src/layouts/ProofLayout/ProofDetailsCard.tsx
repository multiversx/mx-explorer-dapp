import { useSelector } from 'react-redux';

import {
  AccountLink,
  HeroDetailsCard,
  SocialIcons,
  SocialWebsite,
  CopyButton,
  NftProofBadge
} from 'components';
import { proofSelector } from 'redux/selectors';

export const ProofDetailsCard = () => {
  const { proofState } = useSelector(proofSelector);
  const {
    identifier,
    collectionId,
    name,
    nonce,
    tags,
    hash,
    creator,
    properties,

    // ??
    assets
  } = proofState;

  const hasProperties = properties && Object.keys(properties).length > 0;
  const showTags = !hasProperties && tags !== undefined && tags.length > 0;

  return (
    <HeroDetailsCard
      title={identifier}
      seoDetails={{
        title: `${identifier} Proof`
      }}
      className='proof-details'
      detailItems={[
        name
          ? {
              title: 'Name',
              value: <>{name}</>
            }
          : {},
        {
          title: 'Type',
          value: <NftProofBadge />
        },
        { title: 'Identifier', value: identifier },
        collectionId
          ? {
              title: 'Collection',
              value: <>{collectionId}</>
            }
          : {},
        hash
          ? {
              title: 'Proof hash',
              value: (
                <div className='d-flex align-items-center'>
                  <div className='small py-1 px-2 bg-neutral-800 text-break-all rounded'>
                    {hash}
                  </div>
                  <CopyButton text={hash} />
                </div>
              )
            }
          : {},
        assets?.website
          ? {
              title: 'Website',
              value: <SocialWebsite link={assets.website} />
            }
          : {},
        assets?.social && Object.keys(assets.social).length > 0
          ? {
              title: 'Other Links',
              value: <SocialIcons assets={assets.social} excludeWebsite />
            }
          : {},

        creator !== undefined
          ? {
              title: 'Owner',
              value: <AccountLink address={creator} />
            }
          : {},

        showTags
          ? {
              title: 'Tags',
              value: (
                <div className='d-flex flex-wrap gap-2'>
                  {tags.map((tag: string) => (
                    <div
                      key={tag}
                      className='badge badge-outline badge-outline-grey gap-2 text-wrap text-break-all text-start'
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              )
            }
          : {}
      ]}
      statsCards={[{ title: 'Nonce', value: nonce }]}
    />
  );
};
