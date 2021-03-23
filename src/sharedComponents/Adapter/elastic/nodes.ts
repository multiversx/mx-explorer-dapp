import { ProviderPropsType } from '../helpers';
import getNodes from './helpers/getNodes';

const nodes = async ({
  nodeUrl,
  url,
  params = {},
}: {
  url: string;
  nodeUrl: string;
  params: ProviderPropsType['params'];
}) => {
  try {
    const proxyUrl = () => nodeUrl;
    const [, , hash] = url.split('/');
    const queryStringParameters = params ? params : {};

    const {
      from = 0,
      size = 25,
      search,
      online,
      status,
      type,
      shard,
      issues,
      identity,
      sort,
      order = 'asc',
    } = queryStringParameters;

    let results;
    const nodes = await getNodes({ proxyUrl });

    if (hash && hash !== 'count') {
      const node = nodes.find((node: any) => node.publicKey === hash);

      results = node ? { data: node } : { status: 404 };
    } else {
      const data = nodes.filter((node: any) => {
        if (search) {
          const pubKeyMatches = node.publicKey.toLowerCase().includes(search.toLowerCase());
          const nameMatches =
            node.nodeName && node.nodeName.toLowerCase().includes(search.toLowerCase());
          const versionMatches = node.versionNumber.toLowerCase().includes(search.toLowerCase());

          if (!pubKeyMatches && !nameMatches && !versionMatches) {
            return false;
          }
        }

        if (online && node.status !== online) {
          return false;
        }

        if (status && node.peerType !== status) {
          return false;
        }

        if (type && node.nodeType !== type) {
          return false;
        }

        if (
          shard !== undefined &&
          (typeof node.shard === 'undefined' || node.shard.toString() !== shard.toString())
        ) {
          return false;
        }

        if (issues && !(node.issues.length > 0)) {
          return false;
        }

        if (identity && node.identity !== identity) {
          return false;
        }

        return true;
      });

      if (sort && ['nodeName', 'versionNumber', 'totalUpTime', 'tempRating'].includes(sort)) {
        data.sort((a: any, b: any) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0));

        if (order === 'desc') {
          data.reverse();
        }
      }

      if (hash && hash === 'count') {
        results = { data: data.length };
      } else {
        const endIndex = parseInt(String(from)) + parseInt(String(size));
        results = { data: data.slice(parseInt(String(from)), endIndex) };
      }
    }

    return results;
  } catch (error) {
    console.error('nodes error', error);
    throw new Error(error);
  }
};

export default nodes;
