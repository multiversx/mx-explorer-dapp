import {
  NodesGeneralFilter,
  NodesQualifiedFilter,
  NodesStatusFilter,
  Overlay,
  Sort,
  ShardFilter
} from 'components';
import { NodeStatusEnum, NodeType, NodeTypeEnum } from 'types';

import { NodesTableFilterHead } from '../NodesTableFilterHead';

export interface StandardHeadUIType {
  hideFilters?: boolean;
  type?: NodeType['type'];
  status?: NodeType['status'];
  showPosition?: boolean;
}

export const StandardHead = ({
  type,
  status,
  hideFilters
}: StandardHeadUIType) => (
  <thead>
    <tr>
      <th scope='col' data-testid='node'>
        <div className='d-flex align-items-center'>
          <NodesGeneralFilter text='Public Key' hideFilters={hideFilters} />
          {status === NodeStatusEnum.queued && !hideFilters && (
            <Overlay title='Sort by Queue Position'>
              <Sort id='position' text='' />
            </Overlay>
          )}
        </div>
      </th>
      <th scope='col' data-testid='name'>
        <Sort id='name' text='Name' hideFilters={hideFilters} />
      </th>
      <th scope='col' data-testid='shard'>
        <ShardFilter text='Shard' hideFilters={hideFilters} />
      </th>
      <th scope='col' data-testid='version'>
        <Sort id='version' text='Version' hideFilters={hideFilters} />
      </th>
      {type !== NodeTypeEnum.observer && (
        <th scope='col' data-testid='status'>
          <NodesStatusFilter text='Status' hideFilters={hideFilters} />
        </th>
      )}
      {status === NodeStatusEnum.auction && (
        <th scope='col' data-testid='qualified'>
          <NodesQualifiedFilter text='Qualified' hideFilters={hideFilters} />
        </th>
      )}
      {(type === NodeTypeEnum.validator ||
        status === NodeStatusEnum.auction) && (
        <th scope='col' data-testid='lockedStake'>
          <Sort
            id={
              'locked' // TODO: replace locked with qualifiedStake: status === NodeStatusEnum.auction ? 'qualifiedStake' : 'locked'
            }
            text={
              status === NodeStatusEnum.auction
                ? 'Qualified Stake / Node'
                : 'Locked Stake'
            }
            hideFilters={hideFilters}
          />
        </th>
      )}
      {type !== NodeTypeEnum.observer && (
        <>
          {status !== NodeStatusEnum.auction && (
            <th
              scope='col'
              data-testid='validatorIgnoredSignatures'
              style={{ maxWidth: '8rem' }}
            >
              <Sort
                id='validatorIgnoredSignatures'
                text={<Overlay title='Ignored Signatures'>X Sign.</Overlay>}
                hideFilters={hideFilters}
              />
            </th>
          )}
          <th scope='col' data-testid='tempRating'>
            <Sort id='tempRating' text='Rating' hideFilters={hideFilters} />
          </th>
        </>
      )}
      <th scope='col' className='text-end' data-testid='nonce'>
        Nonce
      </th>
    </tr>
    <NodesTableFilterHead />
  </thead>
);
