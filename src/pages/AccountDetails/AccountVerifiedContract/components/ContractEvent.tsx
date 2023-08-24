import { useState } from 'react';
import { Collapse } from 'react-bootstrap';

import { CollapsibleArrows } from 'components';
import { ContractEventType } from 'types';

export const ContractEvent = ({ event }: { event: ContractEventType }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='card card-sm bg-table-header mb-3'>
      <div
        onClick={() => setOpen(!open)}
        aria-controls={event.identifier}
        aria-expanded={open}
        className='card-header cursor-pointer d-flex align-items-center'
      >
        <code>{event.identifier}</code> <CollapsibleArrows expanded={open} />
      </div>
      <Collapse in={open}>
        <div id={event.identifier}>
          <div className='card-body border-top'>
            <div className='d-flex flex-column gap-2'>
              {event?.inputs && event.inputs.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Inputs:</code>
                  </h6>
                  {event?.inputs?.map(({ name, type, indexed }, index) => {
                    return (
                      <div
                        className='px-2 py-1 bg-neutral-900'
                        key={`${name}-${index}`}
                      >
                        <code className='text-neutral-100 me-2'>{name}</code>
                        <code className='text-neutral-400'>{type}</code>
                        {indexed && (
                          <code className='text-neutral-500 border bg-black p-1 ms-2'>
                            indexed
                          </code>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {event?.outputs && event.outputs.length > 0 && (
                <div className='d-flex flex-row flex-wrap align-items-center gap-2'>
                  <h6 className='mb-0'>
                    <code>Outputs:</code>
                  </h6>
                  {event?.outputs?.map(({ type }, index) => {
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
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
