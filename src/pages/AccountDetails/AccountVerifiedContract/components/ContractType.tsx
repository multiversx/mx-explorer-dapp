import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from 'react-bootstrap';

import { CollapsibleArrows } from 'components';
import { faSquarePen } from 'icons/solid';
import { ContractTypeType } from 'types';

export const ContractType = ({
  type,
  typeName
}: {
  type: ContractTypeType;
  typeName: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='card card-sm bg-table-header mb-3'>
      <div
        onClick={() => setOpen(!open)}
        aria-controls={typeName}
        aria-expanded={open}
        className='card-header cursor-pointer d-flex align-items-center'
      >
        <code>{typeName}</code>
        {type?.type && (
          <span className='badge badge-outline badge-outline-grey ms-2 cursor-text'>
            <FontAwesomeIcon icon={faSquarePen} className='me-1 text-primary' />{' '}
            {type.type}
          </span>
        )}
        <CollapsibleArrows expanded={open} />
      </div>
      <Collapse in={open}>
        <div id={typeName}>
          <div className='card-body border-top'>
            <div className='d-flex flex-column gap-2'>
              {type?.fields && type.fields.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Fields:</code>
                  </h6>
                  {type?.fields?.map(({ name, type }, index) => {
                    return (
                      <div
                        className='px-2 py-1 bg-neutral-900'
                        key={`${name}-${index}`}
                      >
                        <code className='text-neutral-100 me-2'>{name}</code>
                        <code className='text-neutral-400'>{type}</code>
                      </div>
                    );
                  })}
                </div>
              )}
              {type?.variants && type.variants.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Variants:</code>
                  </h6>
                  {type?.variants?.map(({ name, discriminant }, index) => {
                    return (
                      <div
                        className='px-2 py-1 bg-neutral-900'
                        key={`${name}-${index}`}
                      >
                        <code className='text-neutral-100 me-2'>{name}</code>
                        <code className='text-neutral-400'>{discriminant}</code>
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
