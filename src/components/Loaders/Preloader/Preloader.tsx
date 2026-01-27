import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { WithClassnameType } from 'types/sdkDapp/sdkDapp.types';

type PreloaderPropsType = WithClassnameType & PropsWithChildren;

export const Preloader = ({ className, children }: PreloaderPropsType) => (
  <div className={classNames('preloader', className)}>{children}</div>
);
