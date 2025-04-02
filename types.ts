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

export interface DatabaseContextType {
    addMarker: (latitude: number, longitude: number) => Promise<string>;
    deleteMarker: (id: string) => Promise<void>;
    getMarkers: () => Promise<MarkerData[]>;
    addImage: (markerId: string, uri: string) => Promise<string>;
    deleteImage: (id: string) => Promise<void>;
    getMarkerImages: (markerId: string) => Promise<ImageData[]>;
    isLoading: boolean;
    error: Error | null;
    getMarkerById: (id: string) => Promise<MarkerData>;
}