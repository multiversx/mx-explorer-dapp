import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Led, NodeDangerZoneTooltip, Overlay } from 'components';
import { useGetNodeFilters } from 'hooks';
import { faScissors } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import {
  NodeType,
  WithClassnameType,
  NodeQualificationStatusEnum
} from 'types';

export interface NodeQualificationUIType extends WithClassnameType {
  node: NodeType;
  showLed?: boolean;
}

export const NodeQualification = ({
  node,
  showLed = true,
  className
}: NodeQualificationUIType) => {
  const {
    isDataReady: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake, notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);
  const { isAuctionDangerZone, isQualified } = useGetNodeFilters();
  const {
    stake,
    auctionTopUp,
    qualifiedStake,
    auctionQualified,
    isInDangerZone
  } = node;

  const bNAuctionTopup = new BigNumber(auctionTopUp ?? 0);
  const bNqualifiedStake =
    qualifiedStake !== undefined
      ? new BigNumber(qualifiedStake)
      : new BigNumber(stake).plus(auctionQualified ? bNAuctionTopup : 0);

  const isDropped =
    !auctionQualified &&
    bNqualifiedStake.isGreaterThan(minimumAuctionQualifiedStake ?? 0) &&
    bNAuctionTopup.isGreaterThan(0);

  const showDangerZone =
    (isAuctionDangerZone && isQualified) || notQualifiedAuctionValidators;

  const NodeStatusComponent = () => {
    if (auctionQualified) {
      return (
        <>
          {showLed && <Led color='bg-success' />}
          <span className='text-success'>
            {NodeQualificationStatusEnum.qualified}
          </span>
          {Boolean(isInDangerZone && showDangerZone) && (
            <NodeDangerZoneTooltip
              auctionQualified={auctionQualified}
              qualifiedStake={bNqualifiedStake.toString(10)}
              isInDangerZone={isInDangerZone}
            />
          )}
        </>
      );
    }

    return (
      <>
        {showLed && <Led color='bg-red-400' />}
        <span className='text-red-400'>
          {NodeQualificationStatusEnum.notQualified}
        </span>
        {isStakeFetched && minimumAuctionQualifiedStake && isDropped && (
          <Overlay title='Dropped'>
            <FontAwesomeIcon
              icon={faScissors}
              className='text-red-400 icon-dropped'
            />
          </Overlay>
        )}
      </>
    );
  };

  return (
    <div className={classNames('d-flex align-items-center gap-2', className)}>
      <NodeStatusComponent />
    </div>
  );
};
