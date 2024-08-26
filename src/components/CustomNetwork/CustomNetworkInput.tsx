import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { networks } from 'config';
import { useCustomNetwork } from 'hooks';
import { faCircleNotch } from 'icons/regular';
import { faCheck } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export const CustomNetworkInput = ({ className }: WithClassnameType) => {
  const activeNetwork = useSelector(activeNetworkSelector);
  const { isCustom: activeNetworkIsCustom } = activeNetwork;

  const configCustomNetwork = networks.filter((network) => network.isCustom)[0];
  const existingCustomNetwork = activeNetworkIsCustom
    ? activeNetwork
    : configCustomNetwork;

  const [customNetworkUrl, setcustomNetworkUrl] = useState<string>(
    existingCustomNetwork?.apiAddress ?? ''
  );
  const [generalError, setGeneralError] = useState('');
  const { setCustomNetwork, isSaving, errors } =
    useCustomNetwork(customNetworkUrl);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCustomNetwork();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralError('');
    setcustomNetworkUrl(e.target.value);
  };

  useEffect(() => {
    if (errors?.apiAddress) {
      setGeneralError(errors.apiAddress);
    }
  }, [errors]);

  return (
    <form
      className={classNames(
        'custom-network-input input-group-black w-100 d-flex',
        className
      )}
    >
      <div className='input-group input-group-sm input-group-seamless has-validation'>
        <input
          type='text'
          className='form-control text-truncate'
          placeholder='API Address'
          name='requestType'
          data-testid='customNetwork'
          required
          value={customNetworkUrl}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          aria-label='API Address'
          aria-describedby='customNetwork-addon'
        />
        <button
          type='submit'
          className='input-group-text'
          onClick={(e) => {
            e.preventDefault();
            setCustomNetwork();
          }}
          data-testid='customNetworkButton'
          aria-label='customNetwork'
        >
          {isSaving ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              spin
              className='me-1 text-primary'
            />
          ) : (
            <FontAwesomeIcon
              icon={faCheck}
              className={classNames('me-1', {
                'text-primary': activeNetworkIsCustom
              })}
            />
          )}
        </button>
        {generalError && (
          <div className='invalid-feedback d-block'>{generalError}</div>
        )}
      </div>
    </form>
  );
};
