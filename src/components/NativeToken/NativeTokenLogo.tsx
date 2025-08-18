import { SVGProps } from 'react';
import { useSelector } from 'react-redux';

import EgldLogo from 'assets/img/tokens/egld-logo.svg';
import SpcLogo from 'assets/img/tokens/spc-logo.svg';
import { isEgldToken } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenLogo = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (isEgldToken(egldLabel)) {
    return <EgldLogo {...props} />;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'spc':
      return <SpcLogo {...props} />;
    default:
      return null;
  }
};
