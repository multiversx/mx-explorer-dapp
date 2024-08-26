import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Collapse } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CUSTOM_NETWORK_ID } from 'appConstants';
import { CollapsibleArrows, CopyButton } from 'components';
import { networks } from 'config';
import { storage, scrollToElement } from 'helpers';
import { useGetNetworkChangeLink } from 'hooks';
import { faTrash, faCheck } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

const NetworkDetail = ({
  title,
  description
}: {
  title: string;
  description: React.ReactNode;
}) => {
  return (
    <div className='d-flex flex-wrap align-items-center gap-1'>
      <div>{title}:</div>
      <div className='text-neutral-100 text-strong'>{description}</div>
    </div>
  );
};

export const CustomNetworkDetails = ({ className }: WithClassnameType) => {
  const getNetworkChangeLink = useGetNetworkChangeLink();
  const activeNetwork = useSelector(activeNetworkSelector);
  const { isCustom: activeNetworkIsCustom } = activeNetwork;

  const configCustomNetwork = networks.filter((network) => network.isCustom)[0];
  const existingCustomNetwork = activeNetworkIsCustom
    ? activeNetwork
    : configCustomNetwork;

  const [open, setOpen] = useState(false);

  const isSavedCustomNetworkActive =
    configCustomNetwork?.id === activeNetwork?.id;

  const removeNetwork = () => {
    storage.removeFromLocal(CUSTOM_NETWORK_ID);
    window.location.href = '/';
  };

  const applyNetwork = () => {
    window.location.href = getNetworkChangeLink({
      networkId: CUSTOM_NETWORK_ID
    });
  };

  if (!existingCustomNetwork) {
    return null;
  }

  return (
    <div className={classNames('custom-network-details', className)}>
      <button
        type='button'
        onClick={() => {
          setOpen(!open);
        }}
        aria-controls='custom-network-details'
        aria-expanded={open}
        className='btn-unstyled d-flex align-items-center justify-content-between'
      >
        Network Details
        <CollapsibleArrows expanded={open} className='ms-2' />
      </button>
      <Collapse
        in={open}
        onEntered={() => {
          scrollToElement('.custom-network-details', 50);
        }}
      >
        <div id='custom-network-details' className='mx-n2'>
          <div className='bg-neutral-850 rounded d-flex flex-column gap-2 mt-2 p-2'>
            {!isSavedCustomNetworkActive && (
              <>
                <div>Saved Custom Network Config</div>
                <NetworkDetail
                  title='Active'
                  description={<code className='text-warning'>false</code>}
                />
              </>
            )}
            {existingCustomNetwork.name && (
              <NetworkDetail
                title='Name'
                description={existingCustomNetwork.name}
              />
            )}
            {existingCustomNetwork.apiAddress && (
              <NetworkDetail
                title='API Address'
                description={
                  <div className='bg-neutral-950 rounded p-1'>
                    <code>{existingCustomNetwork.apiAddress}</code>{' '}
                    <CopyButton
                      text={existingCustomNetwork.apiAddress}
                      className='copy-button'
                    />
                  </div>
                }
              />
            )}
            {existingCustomNetwork.chainId && (
              <NetworkDetail
                title='Chain Id'
                description={
                  <span className='badge badge-sm'>
                    {existingCustomNetwork.chainId}
                  </span>
                }
              />
            )}
            {existingCustomNetwork.egldLabel && (
              <NetworkDetail
                title='Default Token Label'
                description={existingCustomNetwork.egldLabel}
              />
            )}
            <div className='d-flex gap-3 align-items-center'>
              {!isSavedCustomNetworkActive && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    applyNetwork();
                  }}
                  className='btn btn-sm btn-primary align-items-center justify-content-center d-flex flex-grow-1'
                >
                  <FontAwesomeIcon icon={faCheck} className='me-2' />
                  Apply
                </button>
              )}
              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  removeNetwork();
                }}
                className='btn btn-sm btn-dark-alt align-items-center justify-content-center d-flex flex-grow-1'
              >
                <FontAwesomeIcon icon={faTrash} className='me-2' />
                Remove
              </button>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
