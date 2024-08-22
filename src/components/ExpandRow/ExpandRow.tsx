import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { WithClassnameType } from 'types';

interface ExpandRowUIType extends WithClassnameType {
  onClick: () => void;
  count?: number;
  text?: string;
  linkText?: string;
  colSpan?: number;
}

export const ExpandRow = ({
  count,
  text,
  onClick,
  colSpan,
  linkText = 'View All',
  className
}: ExpandRowUIType) => {
  return (
    <tr className={classNames('expand-row', className)}>
      <td colSpan={colSpan}>
        <div className='content-wrapper text-neutral-400 d-flex align-items-start font-headings-regular gap-3'>
          <span>
            {count && text && (
              <>
                .. {new BigNumber(count).toFormat()} {text}
              </>
            )}
          </span>
          <button
            type='button'
            className='btn btn-link-unstyled text-primary font-weight-600'
            onClick={onClick}
          >
            {linkText}
          </button>
        </div>
        <div className='trapezoid'></div>
        <div className='trapezoid reverse'></div>
        <div className='trapezoid'></div>
        <div className='trapezoid reverse'></div>
      </td>
    </tr>
  );
};
