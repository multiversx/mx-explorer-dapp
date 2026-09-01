import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { object, string, number } from 'yup';

import { useAdapter } from 'hooks';
import { markersSelector } from 'redux/selectors';
import { setMarkers } from 'redux/slices';

const schema = object({
  continent: string().defined(),
  city: string().defined(),
  country: string().defined(),
  latitude: number().defined(),
  longitude: number().defined(),
  validators: number().defined()
}).defined();

const MARKERS_RETRY_DELAY = 1500;

export const useFetchMarkers = () => {
  const dispatch = useDispatch();
  const markerUrl = import.meta.env.VITE_APP_MARKERS_API_URL;
  const { getMarkers } = useAdapter();
  const { isDataReady } = useSelector(markersSelector);

  useEffect(() => {
    if (isDataReady || !markerUrl) {
      return;
    }

    const controller = new AbortController();
    let retryTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const fetchMarkers = (isRetry = false) => {
      getMarkers(markerUrl, { signal: controller.signal }).then(
        ({ data, success }) => {
          if (controller.signal.aborted) {
            return;
          }

          if (!(data && success)) {
            if (!isRetry) {
              retryTimeoutId = setTimeout(
                () => fetchMarkers(true),
                MARKERS_RETRY_DELAY
              );
            }

            return;
          }

          schema
            .validate((data as any)[Object.keys(data)[0]], { strict: true })
            .catch(({ errors }) => {
              console.error('Markers format errors: ', errors);
            });

          dispatch(
            setMarkers({
              markers: data,

              isDataReady: success
            })
          );
        }
      );
    };

    fetchMarkers();

    return () => {
      controller.abort();
      clearTimeout(retryTimeoutId);
    };
  }, []);
};
