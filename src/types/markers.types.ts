export interface MarkerType {
  continent: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  validators: number;
}

export interface MarkersType {
  markers: MarkerType[];
}

export interface MarkersSliceType extends MarkersType {
  isFetched: boolean;
}
