import axios from 'axios';
import { getCache, putCache } from './s3Cache';
import confirmNodeIdentity from './confirmNodeIdentity';

const nodeIssues = (node: any, versionNumber: any) => {
  const nodeIssues = [];

  if (node.totalUpTimeSec === 0) {
    nodeIssues.push('offlineSinceGenesis'); // Offline since genesis
  }

  if (versionNumber !== node.versionNumber) {
    nodeIssues.push('outdatedVersion'); // Outdated client version
  }

  if (node.receivedShardID !== node.computedShardID && node.peerType === 'eligible') {
    nodeIssues.push('shuffledOut'); // Shuffled out restart failed
  }

  return nodeIssues;
};

const getNodes = async (args: any & { proxyUrl: () => string }) => {
  let skipCache = false;

  if (args && args.skipCache) {
    skipCache = args.skipCache;
  }

  const key = 'nodes';
  let data: any = await getCache({ key });

  if (data && !skipCache) {
    return data;
  } else {
    data = [];
  }

  const [
    {
      data: {
        data: { heartbeats },
      },
    },
    {
      data: {
        data: { statistics },
      },
    },
    {
      data: {
        data: { config },
      },
    },
  ] = await Promise.all([
    axios.get(`${args.proxyUrl()}/node/heartbeatstatus`), // TODO: check
    axios.get(`${args.proxyUrl()}/validator/statistics`),
    axios.get(`${args.proxyUrl()}/network/config`),
  ]);

  const publicKeys = Object.keys(statistics);

  (heartbeats as any).forEach(({ publicKey }: any) => {
    if (!publicKeys.includes(publicKey)) {
      publicKeys.push(publicKey);
    }
  });

  // tslint:disable-next-line
  for (let i in publicKeys) {
    // eslint-disable-line
    let publicKey = publicKeys[i];

    let node: any = {};
    const found = (heartbeats as any).find((element: any) => element.publicKey === publicKey);

    if (statistics[publicKey]) {
      node = statistics[publicKey];
    }

    if (found) {
      node = { ...node, ...found };
    }

    let {
      nodeDisplayName: nodeName,
      versionNumber,
      identity,
      tempRating,
      rating,
      ratingModifier,
      totalUpTimeSec,
      totalDownTimeSec,
      shardId: shard,
      receivedShardID,
      computedShardID,
      peerType,
      isActive,
      validatorStatus,
    } = node;

    if (shard === undefined) {
      if (peerType === 'observer') {
        shard = receivedShardID;
      } else {
        shard = computedShardID;
      }
    }

    let nodeType;

    peerType = validatorStatus ? validatorStatus : peerType;

    if (peerType === 'observer') {
      peerType = undefined;
      nodeType = 'observer';
    } else {
      nodeType = 'validator';
    }

    const resultNode: any = {
      publicKey,
      nodeName,
      versionNumber: versionNumber ? versionNumber.split('-')[0] : '',
      identity: identity && identity !== '' ? identity.toLowerCase() : identity,
      rating: parseFloat(parseFloat(rating).toFixed(2)),
      tempRating: parseFloat(parseFloat(tempRating).toFixed(2)),
      ratingModifier: ratingModifier ? ratingModifier : 0,
      totalUpTimeSec,
      totalDownTimeSec,
      shard,
      nodeType,
      peerType,
      status: isActive ? 'online' : 'offline',
    };

    if (resultNode.totalUpTimeSec === 0 && node.totalDownTimeSec === 0) {
      resultNode.totalUpTime = node.status === 'online' ? 100 : 0;
      resultNode.totalDownTime = node.status === 'online' ? 0 : 100;
    } else {
      const uptime =
        (resultNode.totalUpTimeSec * 100) /
        (resultNode.totalUpTimeSec + resultNode.totalDownTimeSec);
      resultNode.totalUpTime = parseFloat(uptime.toFixed(2));
      resultNode.totalDownTime = parseFloat((100 - uptime).toFixed(2));
    }

    if (resultNode.identity) {
      const confirmed = await confirmNodeIdentity(resultNode.identity, publicKey);

      if (!confirmed) {
        resultNode.identity = undefined;
      }
    }

    resultNode.issues = nodeIssues(resultNode, (config as any).erd_latest_tag_software_version);

    data.push(resultNode);
  }

  await putCache({ key, value: data, ttl: 70 });

  return data;
};

export default getNodes;
