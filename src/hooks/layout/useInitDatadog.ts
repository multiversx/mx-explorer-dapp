import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

export const useInitDatadog = () => {
  useEffect(() => {
    if (window.location.origin !== 'https://explorer.multiversx.com') {
      return;
    }

    const applicationId = import.meta.env.VITE_APP_DATADOG_APPLICATION_ID;
    const clientToken = import.meta.env.VITE_APP_DATADOG_CLIENT_TOKEN;

    if (!applicationId || !clientToken) {
      return;
    }

    try {
      datadogRum.init({
        applicationId,
        clientToken,
        // `site` refers to the Datadog site parameter of your organization
        // see https://docs.datadoghq.com/getting_started/site/
        site: 'datadoghq.eu',
        service: 'explorer',
        env: 'prod',
        // Specify a version number to identify the deployed version of your application in Datadog
        // version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input'
      });
    } catch (err) {
      console.warn('Unable to load Datadog setup: ', err);
    }
  }, []);
};
