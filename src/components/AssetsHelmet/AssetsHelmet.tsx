import { Helmet } from 'react-helmet-async';
import { TokenAssetType } from 'types';

export const AssetsHelmet = ({
  assets,
  name,
  ticker,
  text
}: {
  assets?: TokenAssetType;
  name?: string;
  ticker?: string;
  text?: string;
}) => {
  const title = `${
    assets
      ? `${name} ${ticker !== name ? `(${ticker})` : ''}`
      : `${ticker ?? ''}`
  } ${text ?? ''}${!ticker ? ' Details' : ''}`;

  return (
    <Helmet prioritizeSeoTags={true}>
      <title>{`${title} • MultiversX Explorer`}</title>
      {assets?.description && (
        <meta name='description' content={assets.description} />
      )}
      <meta name='twitter:title' content={`${title} • MultiversX Explorer`} />
      <meta name='twitter:card' content='summary' />
      {assets?.description && (
        <meta name='twitter:description' content={assets.description} />
      )}
      {assets?.pngUrl && <meta name='twitter:image' content={assets.pngUrl} />}
      <meta property='og:title' content={`${title} • MultiversX Explorer`} />
      {assets?.description && (
        <meta property='og:description' content={assets.description} />
      )}
      {assets?.pngUrl && <meta property='og:image' content={assets.pngUrl} />}
    </Helmet>
  );
};
