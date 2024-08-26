import { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { CUSTOM_NETWORK_ID } from 'appConstants';
import { networks } from 'config';
import { storage } from 'helpers';
import { useAdapter, useGetNetworkChangeLink } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { DappNetworkConfigType, NetworkType, NetworkAdapterEnum } from 'types';

export interface CustomNetworkErrorType {
  apiAddress?: string;
  chainId?: string;
  adapter?: string;
  egldLabel?: string;
  explorerAddress?: string;
}

const validateUrl = (url: string) => {
  if (!url) {
    return 'Required';
  }

  try {
    new URL(url);
    return '';
  } catch (err) {
    return 'Invalid Url';
  }
};

export const useCustomNetwork = (customUrl: string) => {
  const { getNetworkConfig } = useAdapter();
  const getNetworkChangeLink = useGetNetworkChangeLink();
  const activeNetwork = useSelector(activeNetworkSelector);

  const { isCustom: activeNetworkIsCustom } = activeNetwork;
  const configCustomNetwork = networks.filter((network) => network.isCustom)[0];

  const existingNetwork = activeNetworkIsCustom
    ? activeNetwork
    : configCustomNetwork;

  const [isSaving, setIsSaving] = useState<undefined | boolean>();
  const [errors, setErrors] = useState<CustomNetworkErrorType | undefined>();
  const [customNetworkConfig, setCustomNetworkConfig] = useState<
    NetworkType | undefined
  >(existingNetwork);

  const setCustomNetwork = async () => {
    setIsSaving(true);
    setErrors(undefined);
    const urlError = validateUrl(customUrl);
    if (urlError) {
      setErrors((errors) => {
        return { ...errors, apiAddress: urlError };
      });
      setIsSaving(false);
      return;
    }

    const apiAddress = new URL(customUrl).toString().replace(/\/+$/, '');

    const { data, success } = await getNetworkConfig(apiAddress);
    if (data && success) {
      const { chainId, egldLabel, explorerAddress, walletAddress, name } =
        data as DappNetworkConfigType;

      if (chainId && egldLabel && walletAddress && explorerAddress) {
        const customNetwork = {
          id: CUSTOM_NETWORK_ID,
          name: `Custom ${name ?? 'Network'}`,
          adapter: NetworkAdapterEnum.api,
          theme: 'testnet',
          isCustom: true,
          apiAddress,
          chainId,
          egldLabel,
          walletAddress,
          explorerAddress
        };

        try {
          const in30Days = new Date(moment().add(30, 'days').toDate());
          storage.saveToLocal({
            key: CUSTOM_NETWORK_ID,
            data: JSON.stringify([customNetwork]),
            expirationDate: in30Days
          });
        } catch (error) {
          console.error('Unable to Save Custom Network: ', error);
          setErrors((errors) => {
            return { ...errors, apiAddress: 'Unable to Save Custom Network' };
          });
          setIsSaving(false);
          return;
        }

        setCustomNetworkConfig(customNetwork);
        setIsSaving(false);

        // we want to reset the whole state, react router's navigate might lead to unwanted innacuracies
        window.location.href = getNetworkChangeLink({
          networkId: CUSTOM_NETWORK_ID
        });

        return;
      }
    }

    setErrors((errors) => {
      return { ...errors, apiAddress: 'Invalid API Config' };
    });
    setIsSaving(false);
  };

  useEffect(() => {
    if (customUrl) {
      setIsSaving(false);
    }
  }, [customUrl]);

  return { setCustomNetwork, isSaving, customNetworkConfig, errors };
};
