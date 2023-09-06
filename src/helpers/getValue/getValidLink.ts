export const getValidLink = ({
  link,
  baseDomain,
  altBaseDomain,
  replaceAlt = false
}: {
  link?: string;
  baseDomain?: string;
  altBaseDomain?: string;
  replaceAlt?: boolean;
}) => {
  const formatLink = (link: string) => {
    return link.replace(/(^\w+:|^)\/\//, '');
  };

  if (link) {
    try {
      const formattedLink = formatLink(link);
      if (baseDomain) {
        const formattedBase = formatLink(baseDomain);
        let formattedUpdatedBase = '';
        if (altBaseDomain) {
          formattedUpdatedBase = formatLink(altBaseDomain);
        }
        return new URL(
          formattedLink
            .replace(formattedBase, '')
            .replace(formattedUpdatedBase, ''),
          `https://${
            replaceAlt && formattedUpdatedBase
              ? formattedUpdatedBase
              : formattedBase
          }`
        )
          .toString()
          .replace(/\/$/, '');
      }
      return new URL(`https://${formattedLink}`).toString().replace(/\/$/, '');
    } catch {
      return '';
    }
  }

  return '';
};
