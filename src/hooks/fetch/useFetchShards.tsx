import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'hooks';
import { interfaceSelector } from 'redux/selectors';
import { setShards } from 'redux/slices/interface';

export const useFetchShards = () => {
  const dispatch = useDispatch();
  const { getShards } = useAdapter();
  const { shards } = useSelector(interfaceSelector);

  const fetchShards = () => {
    if (shards.length === 0) {
      getShards().then(({ data, success }) => {
        if (data && success) {
          dispatch(setShards(data));
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchShards, []);
};
