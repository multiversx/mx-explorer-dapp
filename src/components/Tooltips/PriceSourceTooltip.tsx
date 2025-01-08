import { InfoTooltip, ModalLink } from 'components';
import { TokenType, WithClassnameType } from 'types';

export interface PriceSourceTooltipUIType extends WithClassnameType {
  token?: TokenType;
}

export const PriceSourceTooltip = ({
  token,
  className
}: PriceSourceTooltipUIType) => {
  if (!token?.assets?.priceSource?.url) {
    return null;
  }

  return (
    <InfoTooltip
      title={
        <>
          Price Source:
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
      persistent
    />
  );
};
