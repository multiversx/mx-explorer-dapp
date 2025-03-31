export const getProofHash = (hash?: string) => {
  if (!hash) {
    return '';
  }

  return hash.split('proof:')[1];
};
