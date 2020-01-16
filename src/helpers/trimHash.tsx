const trimHash = (hash: string) => {
  const keep = 12;
  const start = hash.substring(0, keep);
  const end = hash.substring(hash.length - keep);
  return `${start}...${end}`;
};

export default trimHash;
