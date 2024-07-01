import { SVGProps } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as EgldSymbol } from 'assets/img/tokens/egld-symbol.svg';
import { ReactComponent as SpcLogo } from 'assets/img/tokens/spc-logo.svg';
import { isEgldToken } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// temporary?
export const NativeTokenSymbol = (props: SVGProps<SVGSVGElement>) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (isEgldToken(egldLabel)) {
    return <EgldSymbol {...props} />;
  }

  switch (egldLabel?.toLowerCase()) {
    case 'spc':
      return <SpcLogo {...props} />;
    default:
      return null;
  }
};
