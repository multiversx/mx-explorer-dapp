const urlBuilder = {
  shard: (shard: number | string) => `/blocks?shard=${shard}`,
};

export default urlBuilder;
