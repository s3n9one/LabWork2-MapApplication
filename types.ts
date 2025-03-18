import { LongPressEvent } from 'react-native-maps';

export interface MarkerData {
    id: string;
    latitude: number;
    longitude: number;
    images: ImageData[];
}

export interface ImageData {
    id: string;
    uri: string;
}

export interface MarkerRouteParams {
    id: string;
}

export interface MapProps {
    markers: MarkerData[];
    onLongPress: (event: LongPressEvent) => void;
    onMarkerPress: (markerId: string) => void;
}