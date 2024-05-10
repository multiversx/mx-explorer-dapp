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
          {hideFilters ? (
            'Public Key'
          ) : (
            <NodesGeneralFilter text='Public Key' />
          )}
          {status === NodeStatusEnum.queued && !hideFilters && (
            <Overlay title='Sort by Queue Position'>
              <Sort id='position' text='' />
            </Overlay>
          )}
        </div>
      </th>
      <th scope='col' data-testid='name'>
        {hideFilters ? 'Name' : <Sort id='name' text='Name' />}
      </th>
      <th scope='col' data-testid='shard'>
        {hideFilters ? 'Shard' : <ShardFilter text='Shard' />}
      </th>
      <th scope='col' data-testid='version'>
        {hideFilters ? 'Version' : <Sort id='version' text='Version' />}
      </th>
      {type !== NodeTypeEnum.observer && (
        <th scope='col' data-testid='status'>
          {hideFilters ? 'Status' : <NodesStatusFilter text='Status' />}
        </th>
      )}
      {status === NodeStatusEnum.auction && (
        <th scope='col' data-testid='qualified'>
          {hideFilters ? (
            'Qualified'
          ) : (
            <NodesQualifiedFilter text='Qualified' />
          )}
        </th>
      )}
      {(type === NodeTypeEnum.validator ||
        status === NodeStatusEnum.auction) && (
        <th scope='col' data-testid='lockedStake'>
          {hideFilters ? (
            status === NodeStatusEnum.auction ? (
              'Qualified Stake / Node'
            ) : (
              'Locked Stake'
            )
          ) : (
            <Sort
              id={
                'locked' // TODO: replace locked with qualifiedStake: status === NodeStatusEnum.auction ? 'qualifiedStake' : 'locked'
              }
              text={
                status === NodeStatusEnum.auction
                  ? 'Qualified Stake / Node'
                  : 'Locked Stake'
              }
            />
          )}
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
              {hideFilters ? (
                <Overlay title='Ignored Signatures'>X Sign.</Overlay>
              ) : (
                <Sort
                  id='validatorIgnoredSignatures'
                  text={<Overlay title='Ignored Signatures'>X Sign.</Overlay>}
                />
              )}
            </th>
          )}
          <th scope='col' data-testid='tempRating'>
            {hideFilters ? 'Rating' : <Sort id='tempRating' text='Rating' />}
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
