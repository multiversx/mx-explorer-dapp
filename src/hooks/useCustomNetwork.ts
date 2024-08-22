import { useEffect, useState } from 'react';
import moment from 'moment';

import { LOCAL_STORAGE_CUSTOM_NETWORK } from 'appConstants';
import { storage } from 'helpers';
import { useAdapter } from 'hooks';
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
  const [isSaving, setIsSaving] = useState<undefined | boolean>();
  const [errors, setErrors] = useState<CustomNetworkErrorType | undefined>();
  const [customNetworkConfig, setCustomNetworkConfig] = useState<
    NetworkType | undefined
  >();

  const { getNetworkConfig } = useAdapter();

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
          id: 'custom-network',
          name: `Custom ${name ?? 'Network'}`,
          adapter: NetworkAdapterEnum.api,
          theme: 'testnet',
          apiAddress,
          chainId,
          egldLabel,
          walletAddress,
          explorerAddress
        };

        try {
          const in30Days = new Date(moment().add(30, 'days').toDate());
          storage.saveToLocal({
            key: LOCAL_STORAGE_CUSTOM_NETWORK,
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
