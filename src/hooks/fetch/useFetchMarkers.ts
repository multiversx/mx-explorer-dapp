import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { object, string, number } from 'yup';

import { useAdapter } from 'hooks';
import { markersSelector } from 'redux/selectors';
import { setMarkers } from 'redux/slices/markers';

const schema = object({
  continent: string().defined(),
  city: string().defined(),
  country: string().defined(),
  latitude: number().defined(),
  longitude: number().defined(),
  validators: number().defined()
}).defined();

export const useFetchMarkers = () => {
  const dispatch = useDispatch();
  const markerUrl = process.env.VITE_APP_MARKERS_API_URL;
  const { getMarkers } = useAdapter();
  const { isFetched } = useSelector(markersSelector);

  const fetchMarkers = () => {
    if (!isFetched && markerUrl) {
      getMarkers(markerUrl).then(({ data, success }) => {
        if (data && success) {
          schema
            .validate((data as any)[Object.keys(data)[0]], { strict: true })
            .catch(({ errors }) => {
              console.error('Markers format errors: ', errors);
            });

          dispatch(
            setMarkers({
              markers: data,

              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(fetchMarkers, []);
};
