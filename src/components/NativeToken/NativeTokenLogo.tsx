import { SVGProps } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as EgldLogo } from 'assets/img/tokens/egld-logo.svg';
import { ReactComponent as SpcLogo } from 'assets/img/tokens/spc-logo.svg';

import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenLogo = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (!egldLabel) {
    return;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'egld':
    case 'xegld':
    case 'wegld':
      return <EgldLogo {...props} />;
    case 'spc':
      return <SpcLogo {...props} />;
    default:
      return null;
  }
};
