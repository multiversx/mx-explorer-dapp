import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';

import { faCircleNotch, faCheck } from 'icons/regular';
import { WithClassnameType } from 'types';

export const CustomNetworkInput = ({ className }: WithClassnameType) => {
  const [customNetworkHash, setcustomNetworkHash] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      //    customNetwork();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcustomNetworkHash(e.target.value);
  };

  return (
    <form
      className={classNames(
        'custom-network-input input-group-black w-100 d-flex',
        className
      )}
      //  noValidate={true}
    >
      <div className='input-group input-group-sm input-group-seamless'>
        <input
          type='text'
          className='form-control text-truncate'
          placeholder='API Address'
          name='requestType'
          data-testid='customNetwork'
          required
          value={customNetworkHash}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label='API Address'
          aria-describedby='customNetwork-addon'
        />
        <button
          type='submit'
          className='input-group-text'
          onClick={(e) => {
            e.preventDefault();
            //   customNetwork();
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
            <FontAwesomeIcon icon={faCheck} className='me-1' />
          )}
        </button>
      </div>
    </form>
  );
};
