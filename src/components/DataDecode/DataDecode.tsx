import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Dropdown } from 'react-bootstrap';
import { MAX_DECODE_TX_DATA_LENGTH } from 'appConstants';
import { CopyButton } from 'components';
import { faExclamationTriangle } from 'icons/regular';
import { DecodeMethodEnum, getAllDecodedFormats } from 'lib';
import { WithClassnameType } from 'types';

export interface DataDecodeUIType extends WithClassnameType {
  value: string;
  className?: string;
  initialDecodeMethod?: DecodeMethodEnum;
  setDecodeMethod?: Dispatch<SetStateAction<DecodeMethodEnum>>;
  identifier?: string;
  anchoredContent?: ReactNode;
}

export const DataDecode = ({
  value,
  className,
  initialDecodeMethod,
  setDecodeMethod,
  identifier,
  anchoredContent
}: DataDecodeUIType) => {
  const defaultDecodeMethod =
    initialDecodeMethod &&
    Object.values<string>(DecodeMethodEnum).includes(initialDecodeMethod)
      ? initialDecodeMethod
      : DecodeMethodEnum.raw;

  const [activeKey, setActiveKey] = useState(defaultDecodeMethod);
  const [displayValue, setDisplayValue] = useState('');
  const [validationWarnings, setValidationWarnings] = useState<any>([]);
  const [hasOverflow, setHasOverflow] = useState<boolean>(false);

  const handleSelect = (eventKey: any) => {
    if (!eventKey) {
      return DecodeMethodEnum.raw;
    }

    setActiveKey(eventKey);
  };

  useEffect(() => {
    const decodedDisplay = getAllDecodedFormats({
      data: value,
      highlight: '',
      identifier
    });
    const decodedValue = decodedDisplay[activeKey as DecodeMethodEnum];
    if (!decodedValue) {
      return;
    }
    const { displayValue, validationWarnings } = decodedValue;
    setDisplayValue(displayValue);
    setValidationWarnings(validationWarnings);
  }, [activeKey, value]);

  useEffect(() => {
    if (setDecodeMethod) {
      setDecodeMethod(activeKey);
    }
  }, [activeKey]);

  useEffect(() => {
    if (defaultDecodeMethod !== activeKey) {
      setActiveKey(defaultDecodeMethod);
    }
  }, [defaultDecodeMethod]);

  return (
    <div
      className={`position-relative data-decode mt-1 ${
        hasOverflow ? '' : 'overflow-hidden'
      }`}
    >
      <div className={`form-control textarea ${className ? className : ''}`}>
        {anchoredContent ? anchoredContent : displayValue}
      </div>
      {value && value !== 'N/A' && (
        <div className='d-flex button-holder'>
          <CopyButton text={displayValue} className='copy-button' />
          <Dropdown
            className='position-absolute'
            onSelect={handleSelect}
            onToggle={(e) => {
              setHasOverflow(e);
            }}
          >
            <Dropdown.Toggle
              variant='dark'
              size='sm'
              className={
                'text-capitalize py-1 d-flex align-items-center justify-content-between btn-dark-alt'
              }
              id='decode'
            >
              <span className='me-2'>{activeKey.replace('/', '')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}
            >
              <Dropdown.Item
                as={Anchor} // This is needed due to issues between threejs, react-bootstrap and typescript, what a time to be alive: https://github.com/react-bootstrap/react-bootstrap/issues/6283
                eventKey={DecodeMethodEnum.raw}
                className={activeKey === DecodeMethodEnum.raw ? 'active' : ''}
              >
                Raw
              </Dropdown.Item>
              <Dropdown.Item
                as={Anchor}
                eventKey={DecodeMethodEnum.text}
                className={activeKey === DecodeMethodEnum.text ? 'active' : ''}
              >
                Text
              </Dropdown.Item>
              {value.length < MAX_DECODE_TX_DATA_LENGTH && (
                <>
                  <Dropdown.Item
                    as={Anchor}
                    eventKey={DecodeMethodEnum.decimal}
                    className={
                      activeKey === DecodeMethodEnum.decimal ? 'active' : ''
                    }
                  >
                    Decimal
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Anchor}
                    eventKey={DecodeMethodEnum.smart}
                    className={
                      activeKey === DecodeMethodEnum.smart ? 'active' : ''
                    }
                  >
                    Smart
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      {validationWarnings.length
        ? validationWarnings.map((warning: string, i: number) => (
            <div
              key={i}
              className='d-flex align-items-center mt-1 text-break-all'
            >
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size='xs'
                className='text-warning me-1'
              />
              <small className='text-warning'> {warning}</small>
            </div>
          ))
        : null}
    </div>
  );
};
