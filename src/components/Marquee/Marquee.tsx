import { WithClassnameType } from 'types';

interface MarqueeType extends WithClassnameType {
  children?: React.ReactNode;
}

export const Marquee = ({ children, className }: MarqueeType) => {
  return (
    <div className={`marquee-wrapper ${className ?? ''}`}>
      <div className='marquee'>
        <div className='slide'>{children}</div>
        <div className='slide'>{children}</div>
      </div>
    </div>
  );
};
