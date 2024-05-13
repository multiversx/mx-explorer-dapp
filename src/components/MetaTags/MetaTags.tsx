import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { metaTagsSelector } from 'redux/selectors';

export const MetaTags = () => {
  const { title, pageName, pageDetails, description, preview } =
    useSelector(metaTagsSelector);

  const seoTitle = `${pageDetails ? `${pageDetails} ` : ''}${
    pageName ? `${pageName} • ` : ''
  }${title}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{seoTitle}</title>
      <meta name='description' content={description} />
      <meta name='twitter:title' content={seoTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={preview} />
      <meta name='og:title' content={seoTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={preview} />
    </Helmet>
  );
};
