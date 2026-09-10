import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSearchParams } from 'react-router';

import { useGetNftDisplay } from 'hooks';
import { faGrid, faList } from 'icons/regular';
import { NftDisplayEnum, WithClassnameType } from 'types';

const displayOptions = [
  { display: NftDisplayEnum.list, icon: faGrid, label: 'Grid view' },
  { display: NftDisplayEnum.table, icon: faList, label: 'Table view' }
];

export const NftDisplayToggle = ({ className }: WithClassnameType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { display, ...rest } = Object.fromEntries(searchParams);
  const { nftDisplay } = useGetNftDisplay();

  const onDisplayChange = (nextDisplay: NftDisplayEnum) => {
    if (nextDisplay === nftDisplay) {
      return;
    }

    const nextUrlParams = {
      ...rest,
      ...(nextDisplay === NftDisplayEnum.list ? {} : { display: nextDisplay })
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div
      className={classNames('nft-display-toggle', className)}
      role='group'
      aria-label='NFT display'
    >
      {displayOptions.map(({ display: optionDisplay, icon, label }) => (
        <button
          type='button'
          key={optionDisplay}
          className={classNames('btn-unstyled nft-display-toggle-item', {
            active: nftDisplay === optionDisplay
          })}
          onClick={() => onDisplayChange(optionDisplay)}
          aria-label={label}
          aria-pressed={nftDisplay === optionDisplay}
          data-testid={`nftDisplayToggle${optionDisplay}`}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      ))}
    </div>
  );
};
