import {
  NodesGeneralFilter,
  NodesQualifiedFilter,
  NodesStatusFilter,
  Overlay,
  Sort,
  ShardFilter
} from 'components';
import { NodeStatusEnum, NodeType, NodeTypeEnum } from 'types';

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
  <tr>
    {status === NodeStatusEnum.queued && (
      <th data-testid='position'>
        {hideFilters ? 'Position' : <Sort id='position' text='Position' />}
      </th>
    )}
    <th data-testid='node'>
      {hideFilters ? 'Public Key' : <NodesGeneralFilter text='Public Key' />}
    </th>
    <th data-testid='name'>
      {hideFilters ? 'Name' : <Sort id='name' text='Name' />}
    </th>
    <th data-testid='shard'>
      {hideFilters ? 'Shard' : <ShardFilter text='Shard' />}
    </th>
    <th data-testid='version'>
      {hideFilters ? 'Version' : <Sort id='version' text='Version' />}
    </th>
    {type !== NodeTypeEnum.observer && (
      <th data-testid='status'>
        {hideFilters ? 'Status' : <NodesStatusFilter text='Status' />}
      </th>
    )}
    {status === NodeStatusEnum.auction && (
      <th data-testid='qualified'>
        {hideFilters ? 'Qualified' : <NodesQualifiedFilter text='Qualified' />}
      </th>
    )}
    {(type === NodeTypeEnum.validator || status === NodeStatusEnum.auction) && (
      <th data-testid='lockedStake'>
        {hideFilters ? (
          status === NodeStatusEnum.auction ? (
            'Qualified Stake / Node'
          ) : (
            'Locked Stake'
          )
        ) : (
          <Sort
            id='locked'
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
        <th data-testid='tempRating'>
          {hideFilters ? 'Rating' : <Sort id='tempRating' text='Rating' />}
        </th>
      </>
    )}
    <th className='text-end' data-testid='nonce'>
      Nonce
    </th>
  </tr>
);
