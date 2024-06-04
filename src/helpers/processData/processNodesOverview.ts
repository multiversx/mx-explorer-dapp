import { NodeStatusPreviewType } from 'types';

export const processNodesOverview = (nodes: NodeStatusPreviewType[]) => {
  const indexedNodes = nodes.map((node, index) => {
    return { index: index + 1, ...node };
  });

  return indexedNodes;
};
