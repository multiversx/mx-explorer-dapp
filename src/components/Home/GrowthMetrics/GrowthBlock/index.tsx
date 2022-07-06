import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons/faCaretDown';
import { faCaretUp } from '@fortawesome/pro-solid-svg-icons/faCaretUp';
import { useGlobalState } from 'context';
import { amountWithoutRounding } from 'helpers';

export interface GrowthFieldType {
  text?: string | number;
  prefix?: string;
  percentageChangeColor?: boolean;
  showPercentage?: boolean;
  showPrefix?: boolean;
  isUsd?: boolean;
  isEur?: boolean;
  isEgld?: boolean;
}

export interface GrowthBlockType {
  title: string;
  value: GrowthFieldType;
  description?: GrowthFieldType;
  color?: string;
  usePercentageColor?: 'description' | 'value';
  size?: 'sm' | 'md' | 'lg';
}

const GrowthIcon = ({ text, className }: { text: string | number; className?: string }) => {
  if (String(text).startsWith('-')) {
    return <FontAwesomeIcon className={className} icon={faCaretDown} />;
  } else {
    return <FontAwesomeIcon className={className} icon={faCaretUp} />;
  }
};

const GrowthField = ({
  text = '',
  prefix = '',
  showPercentage = false,
  showPrefix = false,
  isUsd = false,
  isEur = false,
  isEgld = false,
}: GrowthFieldType) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const textPrefix = String(text).startsWith('-') ? '-' : '+';

  return (
    <span className="d-flex align-items-center">
      {showPercentage ? <GrowthIcon className="small mr-1" text={text} /> : null}
      {prefix ? prefix : ''}
      {showPrefix ? textPrefix : ''}
      {isUsd ? '$' : ''}
      {isEur ? '€' : ''}
      {showPercentage
        ? String(text).replace(/^-+/, '')
        : typeof text === 'number'
        ? amountWithoutRounding(String(text))
        : text}
      {isEgld ? ` ${erdLabel}` : ''}
    </span>
  );
};

const GrowthBlock = ({
  title,
  value,
  description,
  color,
  size,
  usePercentageColor,
}: GrowthBlockType) => {
  if (!title && !value) {
    return <></>;
  }

  let colSize = '';
  switch (size) {
    case 'sm':
      colSize = 'col-12 col-sm-4 col-lg-2';
      break;
    case 'md':
      colSize = 'col-12 col-sm-4 col-lg-3';
      break;
    case 'lg':
      colSize = 'col-12 col-sm-4 col-lg-4';
      break;
    default:
      colSize = 'col-12 col-lg-6';
      break;
  }

  let cardColor = color;
  if (usePercentageColor) {
    switch (usePercentageColor) {
      case 'value':
        cardColor = String(value?.text).startsWith('-') ? 'danger' : 'success';
        break;
      case 'description':
        cardColor = String(description?.text).startsWith('-') ? 'danger' : 'success';
        break;
      default:
        cardColor = color;
        break;
    }
  }

  return (
    <div className={`growth-block ${colSize}`}>
      <div
        className={`card shadow-sm d-flex align-items-center justify-content-center ${
          cardColor ? `card-${cardColor}` : ''
        }`}
      >
        <div className="mb-3 title">{title}</div>
        <div className="mb-3 value">
          <GrowthField {...value} />
        </div>
        {description && (
          <div className="mb-3 description">
            <GrowthField {...description} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthBlock;
