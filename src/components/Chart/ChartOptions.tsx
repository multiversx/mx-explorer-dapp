import { useCallback } from 'react';
import { ToggleType, OptionType } from './helpers/types';

export const ChartOptions = ({
  options,
  toggle,
  setToggle,
  className
}: {
  options: OptionType[];
  toggle: ToggleType;
  setToggle: React.Dispatch<React.SetStateAction<ToggleType>>;
  className?: string;
}) => {
  const onToggle = useCallback(
    (needle: string) => {
      setToggle((currentToggle) => ({
        ...currentToggle,
        [needle]: !currentToggle[needle]
      }));
    },
    [setToggle]
  );

  return (
    <div className={`chart-options ${className ? className : ''}`}>
      {options.map((option) => (
        <span
          key={option.key}
          style={{
            textDecoration: toggle[option.key] ? 'none' : 'line-through'
          }}
          onClick={() => onToggle(String(option.key))}
          className='option'
        >
          <span style={{ backgroundColor: option.color }} className='dot' />

          {option.label}
        </span>
      ))}
    </div>
  );
};
