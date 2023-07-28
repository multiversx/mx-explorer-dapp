import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGetURLNetwork } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { changeNetwork as changeStateNetwork } from 'redux/slices';

export const useNetworkRouter = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const urlNetwork = useGetURLNetwork();

  function changeNetwork() {
    if (urlNetwork && activeNetworkId !== urlNetwork.id) {
      dispatch(changeStateNetwork(urlNetwork));
    }
  }

  useEffect(changeNetwork, [urlNetwork, activeNetworkId]);
};
