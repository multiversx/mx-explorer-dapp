import React from 'react';
import { Navigate } from 'react-router-dom';

import { urlBuilder } from 'helpers';
import { useGetHash } from 'hooks';

export const OldRouteRedirect = () => {
  const address = useGetHash();

  return <Navigate replace to={urlBuilder.accountDetails(address ?? '')} />;
};
