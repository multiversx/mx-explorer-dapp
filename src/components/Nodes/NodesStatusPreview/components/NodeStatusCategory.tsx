import classNames from 'classnames';

import { InfoTooltip } from 'components';
import { capitalize } from 'helpers';
import {
  IndexedNodeStatusPreviewType,
  NodeApiStatusEnum,
  WithClassnameType
} from 'types';

import { NodeCell } from './NodeCell';

export interface NodeStatusCategoryUIType extends WithClassnameType {
  nodes: IndexedNodeStatusPreviewType[];
  status?: NodeApiStatusEnum;
  excludedStatuses?: NodeApiStatusEnum[];
  title?: string;
  tooltip?: React.ReactNode;
}

export const NodeStatusCategory = ({
  nodes,
  status,
  excludedStatuses = [],
  title,
  tooltip,
  className
}: NodeStatusCategoryUIType) => {
  const filteredNodes = nodes.filter((node) => {
    const isNotExcluded = Boolean(
      excludedStatuses &&
        excludedStatuses.length > 0 &&
        !excludedStatuses.includes(node.status)
    );
    const isRequiredStatus = status && status === node.status;
    return isRequiredStatus || isNotExcluded;
  });

  if (filteredNodes.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        'node-status-category d-flex flex-wrap gap-3',
        className
      )}
    >
      <div className='category-info d-flex align-items-center justify-content-between gap-3'>
        <div className='d-flex align-items-center flex-nowrap'>
          {title ?? (status ? capitalize(String(status)) : 'Nodes')}
          {tooltip && <InfoTooltip title={tooltip} />}
        </div>
        <div className='text-neutral-100 text-headings-semibold text-align-end'>
          {filteredNodes.length}
        </div>
      </div>
      <div className='category-preview d-flex align-items-center flex-wrap gap-1'>
        {filteredNodes.map((node) => (
          <NodeCell key={node.bls} node={node} />
        ))}
      </div>
    </div>
  );
};
