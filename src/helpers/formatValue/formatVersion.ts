export const formatVersion = (version?: string) => {
  if (!version) {
    return 'Other';
  }

  const arr = version.split('.');
  if (arr.length < 2) {
    return 'Other';
  }

  return version;
};
