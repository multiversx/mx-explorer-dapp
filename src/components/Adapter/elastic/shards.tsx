import getNodes from './helpers/getNodes';

const shards = async ({ proxyUrl: nodeUrl }: { proxyUrl: string }) => {
  const proxyUrl = () => nodeUrl;
  try {
    const data = await getNodes({ proxyUrl });
    const shards: any = [];

    data.forEach((node: any) => {
      if (node.nodeType === 'validator') {
        const existing = shards.find((shard: any) => shard.shard === node.shard);

        if (existing) {
          existing.validators = existing.validators + 1;

          if (node.status === 'online') {
            existing.activeValidators = existing.activeValidators + 1;
          }
        } else {
          shards.push({
            shard: node.shard,
            validators: 1,
            activeValidators: node.status === 'online' ? 1 : 0,
          });
        }
      }
    });

    return { data: shards };
  } catch (error) {
    console.error('shards error', error);
    throw new Error(error);
  }
};

export default shards;
