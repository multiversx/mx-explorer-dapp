import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import { CopyButton } from 'components';

import { ConverterType } from './types';

export const Converter = ({
  title,
  label,
  identifier,
  compute,
  validate
}: ConverterType) => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState('');
  const [computeError, setComputeError] = useState('');

  const fieldError = (() => {
    if (!touched) return '';
    if (!value) return validate.required;
    if (validate.test && !validate.test.callback(value))
      return validate.test.error;
    return '';
  })();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!value || (validate.test && !validate.test.callback(value))) {
      return;
    }

    try {
      setResult(compute(value));
      setComputeError('');
    } catch (err) {
      setComputeError(err instanceof Error ? err.message : 'Conversion failed');
      setResult('');
    }
  };

  return (
    <div className='card card-black' id={identifier}>
      <div className='card-header'>
        <h6 className='m-0'>{title}</h6>
      </div>
      <div className='card-body'>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              isInvalid={Boolean(fieldError)}
              autoComplete='off'
              spellCheck={false}
              data-testid={`${identifier}-input`}
            />
            <Form.Control.Feedback type='invalid'>
              {fieldError}
            </Form.Control.Feedback>
          </Form.Group>
          <button type='submit' className='btn btn-primary btn-sm mt-3'>
            Convert
          </button>
        </Form>

        {computeError && (
          <div className='text-danger small mt-3'>{computeError}</div>
        )}

        {result && (
          <div className='mt-3'>
            <div className='text-neutral-400 small mb-1'>Result</div>
            <div className='d-flex align-items-center gap-2 word-break-all'>
              <code>{result}</code>
              <CopyButton text={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
