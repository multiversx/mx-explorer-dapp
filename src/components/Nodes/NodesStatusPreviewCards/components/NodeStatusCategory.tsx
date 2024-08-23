import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { InfoTooltip } from 'components';
import { capitalize } from 'helpers';
import { nodesOverviewSelector } from 'redux/selectors';
import { NodeApiStatusEnum, NodeTypeEnum, WithClassnameType } from 'types';

import { NodeCell } from './NodeCell';

export interface NodeStatusCategoryUIType extends WithClassnameType {
  status?: NodeApiStatusEnum;
  excludedStatuses?: NodeApiStatusEnum[];
  title?: string;
  tooltip?: React.ReactNode;
}

export const NodeStatusCategory = ({
  status,
  excludedStatuses = [],
  title,
  tooltip,
  className
}: NodeStatusCategoryUIType) => {
  const { nodes } = useSelector(nodesOverviewSelector);
  const filteredNodes = nodes.filter((node) => {
    const isNotExcluded = Boolean(
      excludedStatuses &&
        excludedStatuses.length > 0 &&
        !excludedStatuses.includes(node.status)
    );
    const isRequiredStatus = status && status === node.status;

    return (
      node.type === NodeTypeEnum.validator &&
      (isRequiredStatus || isNotExcluded)
    );
  });

  if (filteredNodes.length === 0) {
    return null;
  }

  return (
    <div className={classNames('node-status-category d-flex gap-3', className)}>
      <div className='category-info d-flex align-items-start justify-content-between gap-3'>
        <div className='category-title d-flex align-items-center flex-nowrap text-neutral-400 lh-1'>
          {title ?? (status ? capitalize(String(status)) : 'Nodes')}
          {tooltip && <InfoTooltip title={tooltip} />}
        </div>
        <div className='text-neutral-100 font-headings-semibold text-align-end category-count lh-1'>
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
