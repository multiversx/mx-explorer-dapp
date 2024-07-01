import { SVGProps } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as EgldSymbol } from 'assets/img/tokens/egld-symbol.svg';
import { ReactComponent as SpcLogo } from 'assets/img/tokens/spc-logo.svg';

import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenSymbol = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (!egldLabel) {
    return;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'egld':
    case 'xegld':
    case 'wegld':
      return <EgldSymbol {...props} />;
    case 'spc':
      return <SpcLogo {...props} />;
    default:
      return null;
  }
};
