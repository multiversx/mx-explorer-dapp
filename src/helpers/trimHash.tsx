const trimHash = (hash: string) => {
  const keep = 10;
  const start = hash.substring(0, keep);
  const end = hash.substring(hash.length - keep);
  return `${start}...${end}`;
};

export default trimHash;
