import classNames from 'classnames';
import { useMatch } from 'react-router-dom';

import { InfoTooltip, ModalLink } from 'components';
import { useGetSort, useNetworkRoute } from 'hooks';
import { tokensRoutes } from 'routes';
import { TokenSortEnum, TokenType, WithClassnameType } from 'types';

export interface PriceSourceTooltipUIType extends WithClassnameType {
  token?: TokenType;
}

export const PriceSourceTooltip = ({
  token,
  className
}: PriceSourceTooltipUIType) => {
  const { sort } = useGetSort();
  const networkRoute = useNetworkRoute();
  const isTokensRoute = useMatch(networkRoute(tokensRoutes.tokens));
  const isPriceSorting =
    sort === TokenSortEnum.price || sort === TokenSortEnum.marketCap;

  if (!token?.assets?.priceSource?.url) {
    return null;
  }

  return (
    <InfoTooltip
      title={
        <>
          Self-Reported Price Source:
          <br />
          <ModalLink
            href={token.assets.priceSource.url}
            target='_blank'
            rel='noreferrer nofollow noopener'
            className='text-break-all'
          >
            {token.assets.priceSource.url}
          </ModalLink>
        </>
      }
      className={className}
      iconClassName={classNames({
        'text-warning': isPriceSorting && isTokensRoute
      })}
      persistent
    />
  );
};
