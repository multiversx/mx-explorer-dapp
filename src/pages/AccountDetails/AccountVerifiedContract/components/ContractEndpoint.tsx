import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from 'react-bootstrap';

import { Overlay, CollapsibleArrows } from 'components';
import { faQuestionCircle } from 'icons/regular';
import { faUserCheck, faSquarePen, faSquareV } from 'icons/solid';
import { ContractEndpointType } from 'types';

export const ContractEndpoint = ({
  endpoint
}: {
  endpoint: ContractEndpointType;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='card card-sm bg-table-header mb-3'>
      <div
        onClick={() => setOpen(!open)}
        aria-controls={endpoint.name}
        aria-expanded={open}
        className='card-header cursor-pointer d-flex align-items-center'
      >
        <code>{endpoint?.name}</code>
        {endpoint?.onlyOwner && (
          <span className='badge badge-outline badge-outline-grey ms-2 cursor-text'>
            <FontAwesomeIcon icon={faUserCheck} className='me-1 text-primary' />{' '}
            Only Owner
          </span>
        )}
        {endpoint?.mutability && (
          <span className='badge badge-outline badge-outline-grey ms-2 cursor-text'>
            {endpoint.mutability === 'mutable' ? (
              <>
                <FontAwesomeIcon
                  icon={faSquarePen}
                  className='me-1 text-primary'
                />{' '}
                endpoint
              </>
            ) : (
              ''
            )}
            {endpoint.mutability === 'readonly' ? (
              <>
                <FontAwesomeIcon
                  icon={faSquareV}
                  className='me-1 text-primary'
                />{' '}
                view
              </>
            ) : (
              ''
            )}
          </span>
        )}
        {endpoint?.docs && (
          <div className='ms-2'>
            <>
              {endpoint.docs.map((row, key) => {
                <p key={key} className='mb-0'>
                  {row}
                </p>;
              })}
            </>
            <Overlay
              title={
                <>
                  {endpoint.docs.map((row, key) => (
                    <code key={key} className='mb-0'>
                      {row}
                    </code>
                  ))}
                </>
              }
              className='d-flex'
              tooltipClassName='endpoint-docs'
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className='small text-neutral-400 ms-1'
              />
            </Overlay>
          </div>
        )}
        <CollapsibleArrows expanded={open} />
      </div>
      <Collapse in={open}>
        <div id={endpoint.name}>
          <div className='card-body border-top'>
            <div className='d-flex flex-column gap-2'>
              {endpoint?.inputs && endpoint.inputs.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Inputs:</code>
                  </h6>
                  {endpoint?.inputs?.map(({ name, type, multi_arg }, index) => {
                    return (
                      <div
                        className='px-2 py-1 bg-neutral-900'
                        key={`${name}-${index}`}
                      >
                        <code className='text-neutral-100 me-2'>{name}</code>
                        <code className='text-neutral-400'>{type}</code>
                        {multi_arg && (
                          <code className='text-neutral-500 border bg-black p-1 ms-2'>
                            multi_arg
                          </code>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {endpoint?.outputs && endpoint.outputs.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Outputs:</code>
                  </h6>
                  {endpoint?.outputs?.map(({ type }, index) => {
                    return (
                      <div
                        className='px-2 py-1 bg-neutral-900'
                        key={`${type}-${index}`}
                      >
                        <code className='text-neutral-400'>{type}</code>
                      </div>
                    );
                  })}
                </div>
              )}
              {endpoint?.payableInTokens &&
                endpoint.payableInTokens.length > 0 && (
                  <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                    <h6 className='mb-0'>
                      <code>Payable In Tokens:</code>
                    </h6>
                    {endpoint?.payableInTokens?.map((token, index) => {
                      return (
                        <div
                          className='px-2 py-1 bg-neutral-900'
                          key={`${token}-${index}`}
                        >
                          <code className='text-neutral-400'>{token}</code>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
