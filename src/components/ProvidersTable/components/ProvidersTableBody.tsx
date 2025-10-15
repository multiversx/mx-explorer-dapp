import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import {
  CopyButton,
  FormatAmount,
  NetworkLink,
  Overlay,
  LockedStakeTooltip,
  PageState,
  SharedIdentity,
  Trim,
  ExpandRow
} from 'components';
import { formatBigNumber, getStringPlural, urlBuilder } from 'helpers';
import { faCode } from 'icons/regular';

import { faBadgeCheck } from 'icons/solid';
import { DelegationCap, PercentageFilled } from '../components';
import { ProvidersTableUIType } from '../ProvidersTable';

export const ProvidersTableBody = ({
  providers,
  showIndex = true,
  showIdentity = true,
  hasExpand
}: ProvidersTableUIType) => {
  const [displayExpandedProviders, setDisplayExpandedProviders] =
    useState(false);

  if (hasExpand && !displayExpandedProviders && providers.length > 0) {
    return (
      <tbody>
        <ExpandRow
          count={providers.length}
          linkText={`View ${providers.length} inactive Staking Providers`}
          onClick={() => {
            setDisplayExpandedProviders(true);
            return;
          }}
          colSpan={8}
        />
      </tbody>
    );
  }

  return (
    <tbody data-testid='providersTable'>
      {providers.map((provider, i) => {
        const displayValidators =
          provider.identityInfo?.validators ?? provider.numNodes;

        return (
          <tr key={provider.provider}>
            {showIndex && <td>{provider.rank}</td>}
            <td>
              <div className='d-flex align-items-center hash hash-lg gap-2'>
                {showIdentity && (
                  <SharedIdentity.Avatar
                    identity={provider.identityInfo}
                    className='me-2'
                  />
                )}
                <NetworkLink
                  to={urlBuilder.providerDetails(provider.provider)}
                  className='trim-wrapper'
                  data-testid={`providerLink${i}`}
                >
                  {provider.identityInfo?.name && showIdentity ? (
                    <span className='text-truncate'>
                      {provider.identityInfo.name}
                    </span>
                  ) : (
                    <Trim text={provider.provider} />
                  )}
                </NetworkLink>
                {showIdentity && provider.featured && (
                  <Overlay title='Verified'>
                    <FontAwesomeIcon
                      icon={faBadgeCheck}
                      size='sm'
                      className='text-primary'
                    />
                  </Overlay>
                )}
                {!showIdentity && <CopyButton text={provider.provider} />}
              </div>
            </td>
            <td>
              {provider.locked ? (
                <Overlay
                  title={
                    <LockedStakeTooltip
                      stake={provider.stake}
                      topUp={provider.topUp}
                    />
                  }
                  tooltipClassName='tooltip-text-start tooltip-lg'
                  truncate
                >
                  <FormatAmount value={provider.locked} showTooltip={false} />
                </Overlay>
              ) : (
                <>N/A</>
              )}
            </td>
            <td>
              {displayValidators !== undefined ? (
                <>
                  {displayValidators}{' '}
                  {getStringPlural(displayValidators, {
                    string: 'node'
                  })}
                </>
              ) : (
                <>N/A</>
              )}
            </td>
            <td>
              {provider.apr ? (
                <>
                  {provider.apr}
                  {provider.apr !== 'N/A' ? '%' : ''}
                </>
              ) : (
                <>N/A</>
              )}
            </td>
            <td>
              {provider.serviceFee ? (
                <>
                  {formatBigNumber({
                    value: new BigNumber(provider.serviceFee).times(100)
                  })}
                  %
                </>
              ) : (
                <>N/A</>
              )}
            </td>
            <td>
              {provider.delegationCap ? (
                <DelegationCap delegationCap={provider.delegationCap} />
              ) : (
                <>N/A</>
              )}
            </td>
            <td>
              {provider.locked && provider.delegationCap ? (
                <PercentageFilled
                  locked={provider.locked}
                  delegationCap={provider.delegationCap}
                />
              ) : (
                <>N/A</>
              )}
            </td>
          </tr>
        );
      })}

      {providers.length === 0 && (
        <tr>
          <td colSpan={7}>
            <PageState icon={faCode} title='No Providers' isError />
          </td>
        </tr>
      )}
    </tbody>
  );
};
