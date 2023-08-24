import { Navigate, useParams } from 'react-router-dom';

import { urlBuilder } from 'helpers';

export const OldRouteRedirect = () => {
  const { hash: address } = useParams();

  return <Navigate replace to={urlBuilder.accountDetails(address ?? '')} />;
};
