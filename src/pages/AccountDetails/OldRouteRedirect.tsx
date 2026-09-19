import { Navigate, useParams } from 'react-router';

import { urlBuilder } from 'helpers';

export const OldRouteRedirect = () => {
  const { hash: address } = useParams();

  return <Navigate replace to={urlBuilder.accountDetails(address ?? '')} />;
};
