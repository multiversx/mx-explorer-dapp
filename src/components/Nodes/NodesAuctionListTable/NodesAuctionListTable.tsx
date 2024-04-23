import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, ZERO } from 'appConstants';
import {
  FormatAmount,
  NodeTreshold,
  LockedStakeTooltip,
  Overlay,
  PageState,
  Led,
  NodeDangerZoneTooltip,
  FormatNumber,
  NetworkLink,
  SharedIdentity,
  Trim
} from 'components';
import { urlBuilder } from 'helpers';
import { faCogs } from 'icons/regular';
import { AuctionValidatorType, WithClassnameType } from 'types';

export interface NodesAuctionListTableUIType extends WithClassnameType {
  auctionListValidators?: AuctionValidatorType[];
  showPosition?: boolean;
}

export const NodesAuctionListTable = ({
  auctionListValidators,
  showPosition = true,
  className
}: NodesAuctionListTableUIType) => {
  const [searchParams] = useSearchParams();
  const { isQualified, isAuctionDangerZone } = Object.fromEntries(searchParams);

  let filterText = '';
  if (isQualified !== undefined) {
    if (isQualified) {
      filterText = 'Qualified';
    }
    filterText = 'Not Qualified';
  }
  if (isAuctionDangerZone) {
    filterText = 'Qualified in Danger Zone';
  }

  const filteredValidators =
    isQualified === undefined && isAuctionDangerZone === undefined
      ? auctionListValidators
      : auctionListValidators.filter((validator) => {
          if (
            isQualified === 'true' &&
            isAuctionDangerZone === undefined &&
            validator.qualifiedAuctionValidators > 0
          ) {
            return true;
          }
          if (
            isAuctionDangerZone === 'true' &&
            validator.qualifiedAuctionValidators > 0 &&
            validator.dangerZoneValidators > 0
          ) {
            return true;
          }

          if (
            isQualified === 'false' &&
            validator.qualifiedAuctionValidators === 0
          ) {
            return true;
          }

          return false;
        });

  if (filteredValidators.length === 0) {
    return (
      <PageState
        icon={faCogs}
        title={`No ${
          filterText ? `${filterText} ` : ''
        }Validators in Auction List`}
      />
    );
  }

  const tableTotalAuction = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(new BigNumber(currentValue?.auctionValidators ?? 0)),
    new BigNumber(0)
  );
  const tableTotalDropped = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(new BigNumber(currentValue?.droppedValidators ?? 0)),
    new BigNumber(0)
  );
  const tableTotalQualified = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(currentValue?.qualifiedAuctionValidators ?? 0)
      ),
    new BigNumber(0)
  );

  return (
    <div className={classNames('auction-list-table table-wrapper', className)}>
      <table className='table mb-0'>
        <thead>
          <tr>
            {showPosition && <th className='th-rank'>#</th>}
            <th className='th-eligibility'>Identity</th>
            <th className='th-identity'>Auction List Nodes</th>
            <th className='th-dropped'>Dropped</th>
            <th className='th-qualified'>Qualified</th>
            <th className='th-stake'>Qualified Stake / Node</th>
            <th className='th-info'>Delta</th>
          </tr>
        </thead>
        <tbody>
          {filteredValidators.map(
            (
              {
                name,
                stake,
                owner,
                identity,
                avatar,
                auctionTopUp,
                qualifiedStake,
                auctionValidators,
                qualifiedAuctionValidators,
                dangerZoneValidators,
                droppedValidators,
                auctionPosition
              },
              index
            ) => {
              const identityLink = identity
                ? urlBuilder.identityDetails(identity)
                : owner
                ? urlBuilder.providerDetails(owner)
                : name
                ? urlBuilder.nodeDetails(name)
                : '';
              const multipleIdentityEntries = filteredValidators.filter(
                ({ identity: filterIdentity }) => filterIdentity === identity
              );

              return (
                <tr key={auctionPosition ?? index}>
                  {showPosition && <td>{auctionPosition ?? index + 1}</td>}
                  <td>
                    <div className='d-flex align-items-center'>
                      <NetworkLink to={identityLink}>
                        <SharedIdentity.Avatar
                          identity={{ identity, name, avatar }}
                        />
                      </NetworkLink>
                      <div className='d-flex flex-column'>
                        {identityLink && (
                          <NetworkLink
                            to={identityLink}
                            className='trim-wrapper trim-size-xl'
                          >
                            {name && name.length > 70 ? (
                              <Trim text={name} />
                            ) : (
                              <>{name ?? 'N/A'}</>
                            )}
                          </NetworkLink>
                        )}
                        {multipleIdentityEntries.length > 1 && owner && (
                          <span className='text-neutral-400 trim-wrapper trim-size-xl'>
                            <Trim text={owner} className='text-neutral-400' />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{auctionValidators ? auctionValidators : ELLIPSIS}</td>
                  <td className='text-red-400'>
                    {droppedValidators ? droppedValidators : ZERO}
                  </td>
                  <td>
                    <div
                      className={classNames('d-flex align-items-center gap-2', {
                        'text-success': qualifiedAuctionValidators,
                        'text-red-400': !qualifiedAuctionValidators
                      })}
                    >
                      <Led
                        color={classNames('mt-0', {
                          'bg-success': qualifiedAuctionValidators,
                          'bg-red-400': !qualifiedAuctionValidators
                        })}
                      />
                      {qualifiedAuctionValidators &&
                      qualifiedAuctionValidators > 0 ? (
                        <FormatNumber value={qualifiedAuctionValidators} />
                      ) : (
                        ZERO
                      )}
                      {dangerZoneValidators > 0 && qualifiedStake && (
                        <NodeDangerZoneTooltip
                          qualifiedStake={qualifiedStake}
                        />
                      )}
                    </div>
                  </td>
                  <td className='text-neutral-100'>
                    {qualifiedStake ? (
                      <Overlay
                        title={
                          <LockedStakeTooltip
                            stake={stake}
                            auctionTopUp={auctionTopUp}
                            showAuctionTopup
                          />
                        }
                        tooltipClassName='tooltip-text-start tooltip-lg'
                        persistent
                        truncate
                      >
                        <FormatAmount
                          value={qualifiedStake}
                          showTooltip={false}
                        />
                      </Overlay>
                    ) : (
                      ELLIPSIS
                    )}
                  </td>
                  <td>
                    <NodeTreshold
                      qualifiedStake={qualifiedStake}
                      showPercentage
                    />
                  </td>
                </tr>
              );
            }
          )}
          <tr>
            {showPosition && <td></td>}
            <td></td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalAuction} /> nodes
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalDropped} /> nodes
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalQualified} /> nodes
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
