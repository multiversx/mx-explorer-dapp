import { forwardRef } from 'react';
import classNames from 'classnames';
import { Dropdown } from 'react-bootstrap';

import { CustomNetworkInput, CustomNetworkDetails } from 'components';

export const CustomNetworkMenu = forwardRef(
  ({ children, className, style }: any, ref: any) => {
    return (
      <div
        ref={ref}
        className={classNames('custom-network-menu', className)}
        style={style}
      >
        <div className='network-list'>{children}</div>
        <Dropdown.Divider />
        <div className='d-flex flex-column gap-2 px-3 pb-2'>
          Custom Network API Address
          <CustomNetworkInput />
          <CustomNetworkDetails />
        </div>
      </div>
    );
  }
);
