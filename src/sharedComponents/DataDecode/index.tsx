import * as React from 'react';
import BigNumber from 'bignumber.js';
import { Dropdown } from 'react-bootstrap';
import { addressIsBech32, bech32 } from 'helpers';

type DecodeMethodType = 'raw' | 'text' | 'decimal' | 'address' | string;

const decode = (part: string, decodeMethod: DecodeMethodType) => {
  switch (decodeMethod) {
    case 'text':
      try {
        return Buffer.from(String(part), 'hex').toString('utf8').trim();
      } catch {}
      return part;
    case 'decimal':
      const bn = new BigNumber(part, 16);
      return bn.toString(10);
    case 'address':
      try {
        const bech32Encoded = bech32.encode(part);
        if (addressIsBech32(bech32Encoded)) {
          return bech32Encoded;
        }
      } catch {}
      return part;
    case 'raw':
    default:
      return part;
  }
};

const DataDecode = ({
  value,
  className,
  readOnly,
}: {
  value: string;
  className?: string;
  readOnly?: boolean;
}) => {
  const [activeKey, setActiveKey] = React.useState<DecodeMethodType>('raw');
  const [displayValue, setDisplayValue] = React.useState('');

  React.useEffect(() => {
    if (value.includes('@') || value.includes('\n')) {
      if (value.includes('@')) {
        const parts = value.split('@');
        const decodedParts = parts.map((part, index) => {
          if (parts.length >= 2 && (index === 0 || (index === 1 && !parts[0]))) {
            return part;
          } else {
            return decode(part, activeKey);
          }
        });
        setDisplayValue(decodedParts.join('@'));
      }
      if (value.includes('\n')) {
        const parts = value.split('\n');
        const decodedParts = parts.map((part, index) => {
          const base64Buffer = Buffer.from(String(part), 'base64');
          if (activeKey === 'raw') {
            return part;
          } else {
            return decode(base64Buffer.toString('hex').trim(), activeKey);
          }
        });
        setDisplayValue(decodedParts.join('\n'));
      }
    } else {
      setDisplayValue(decode(value, activeKey));
    }
  }, [activeKey, value]);

  return (
    <div className="position-relative data-decode mt-1">
      <div
        className={`form-control textarea cursor-text ${className ? className : ''} ${
          readOnly ? 'readonly' : ''
        }`}
      >
        {displayValue}
      </div>
      {value && value !== 'N/A' && (
        <Dropdown
          className="position-absolute dropdown"
          onSelect={(selectedKey: DecodeMethodType) => {
            return selectedKey ? setActiveKey(selectedKey) : 'raw';
          }}
        >
          <Dropdown.Toggle
            variant="light"
            size="sm"
            className={`border text-capitalize`}
            id="decode"
          >
            {activeKey}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}>
            <Dropdown.Item eventKey="raw" className={`${activeKey === 'raw' ? 'active' : ''}`}>
              Raw
            </Dropdown.Item>
            <Dropdown.Item eventKey="text" className={`${activeKey === 'text' ? 'active' : ''}`}>
              Text
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="decimal"
              className={`${activeKey === 'decimal' ? 'active' : ''}`}
            >
              Decimal
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="address"
              className={`${activeKey === 'address' ? 'active' : ''}`}
            >
              Address
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default DataDecode;
