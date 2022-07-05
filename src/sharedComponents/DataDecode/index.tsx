import * as React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { Dropdown } from 'react-bootstrap';
import { addressIsBech32, bech32, isUtf8 } from 'helpers';
import { TransactionTokensType } from 'helpers/types';
import { decodeLimit } from 'appConfig';

export enum DecodeMethodType {
  raw = 'raw',
  text = 'text',
  decimal = 'decimal',
  smart = 'smart',
}

const isHexValidCharacters = (str: string) => {
  return str.toLowerCase().match(/[0-9a-f]/g);
};
const isHexValidLength = (str: string) => {
  return str.length % 2 === 0;
};

const getHexValidationWarnings = (str: string) => {
  const warnings = [];
  if (str && !isHexValidCharacters(str)) {
    warnings.push(`Invalid Hex characters on argument @${str}`);
  }
  if (str && !isHexValidLength(str)) {
    warnings.push(`Odd number of Hex characters on argument @${str}`);
  }

  return warnings;
};

const decode = (
  part: string,
  decodeMethod: DecodeMethodType | string,
  transactionTokens?: TransactionTokensType
) => {
  switch (decodeMethod) {
    case DecodeMethodType.text:
      try {
        return Buffer.from(String(part), 'hex').toString('utf8');
      } catch {}
      return part;
    case DecodeMethodType.decimal:
      const bn = new BigNumber(part, 16);
      return bn.toString(10);
    case DecodeMethodType.smart:
      try {
        const bech32Encoded = bech32.encode(part);
        if (addressIsBech32(bech32Encoded)) {
          return bech32Encoded;
        }
      } catch {}
      try {
        const decoded = Buffer.from(String(part), 'hex').toString('utf8');
        if (!isUtf8(decoded)) {
          if (transactionTokens) {
            const tokens = [...transactionTokens.esdts, ...transactionTokens.nfts];
            if (tokens.some((token) => decoded.includes(token))) {
              return decoded;
            }
          }
          const bn = new BigNumber(part, 16);
          return bn.toString(10);
        } else {
          return decoded;
        }
      } catch {}
      return part;
    case DecodeMethodType.raw:
    default:
      return part;
  }
};

const DataDecode = ({
  value,
  className,
  transactionTokens,
  initialDecodeMethod,
  setDecodeMethod,
}: {
  value: string;
  className?: string;
  transactionTokens?: TransactionTokensType;
  initialDecodeMethod?: DecodeMethodType | string;
  setDecodeMethod?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [activeKey, setActiveKey] = React.useState(
    initialDecodeMethod && Object.values<string>(DecodeMethodType).includes(initialDecodeMethod)
      ? initialDecodeMethod
      : DecodeMethodType.raw
  );
  const [displayValue, setDisplayValue] = React.useState('');
  const [validationWarnings, setValidationWarnings] = React.useState<any>([]);

  React.useEffect(() => {
    if (value.includes('@') || value.includes('\n')) {
      if (value.includes('@')) {
        const parts = value.split('@');
        const decodedParts = parts.map((part, index) => {
          if (
            parts.length >= 2 &&
            ((index === 0 && part.length < 64) || (index === 1 && !parts[0]))
          ) {
            return part;
          } else {
            const hexValidationWarnings = getHexValidationWarnings(part);
            if (hexValidationWarnings.length) {
              setValidationWarnings(
                Array.from(new Set([...validationWarnings, ...hexValidationWarnings]))
              );
            }

            return decode(part, activeKey, transactionTokens);
          }
        });
        setDisplayValue(decodedParts.join('@'));
      }
      if (value.includes('\n')) {
        const parts = value.split('\n');
        const decodedParts = parts.map((part, index) => {
          const base64Buffer = Buffer.from(String(part), 'base64');
          if (activeKey === DecodeMethodType.raw) {
            return part;
          } else {
            return decode(base64Buffer.toString('hex'), activeKey, transactionTokens);
          }
        });
        setDisplayValue(decodedParts.join('\n'));
      }
    } else {
      setDisplayValue(decode(value, activeKey, transactionTokens));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, value, transactionTokens]);

  React.useEffect(() => {
    if (setDecodeMethod) {
      setDecodeMethod(activeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <div className="position-relative data-decode mt-1">
      <div className={`form-control textarea ${className ? className : ''}`}>{displayValue}</div>
      {value && value !== 'N/A' && (
        <Dropdown
          className="position-absolute dropdown"
          onSelect={(eventKey: any) => {
            return eventKey ? setActiveKey(eventKey) : DecodeMethodType.raw;
          }}
        >
          <Dropdown.Toggle
            variant="light"
            size="sm"
            className={`border text-capitalize py-1`}
            id="decode"
          >
            {activeKey.replace('/', '')}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}>
            <Dropdown.Item
              eventKey={DecodeMethodType.raw}
              className={`${activeKey === DecodeMethodType.raw ? 'active' : ''}`}
            >
              Raw
            </Dropdown.Item>
            <Dropdown.Item
              eventKey={DecodeMethodType.text}
              className={`${activeKey === DecodeMethodType.text ? 'active' : ''}`}
            >
              Text
            </Dropdown.Item>
            {value.length < decodeLimit && (
              <>
                <Dropdown.Item
                  eventKey={DecodeMethodType.decimal}
                  className={`${activeKey === DecodeMethodType.decimal ? 'active' : ''}`}
                >
                  Decimal
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey={DecodeMethodType.smart}
                  className={`${activeKey === DecodeMethodType.smart ? 'active' : ''}`}
                >
                  Smart
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {validationWarnings.length
        ? validationWarnings.map((warning: string, i: number) => (
            <div key={i} className="d-flex align-items-center mt-1 text-break-all">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="xs"
                className="text-warning mr-1"
              />
              <small className="text-warning"> {warning}</small>
            </div>
          ))
        : null}
    </div>
  );
};

export default DataDecode;
