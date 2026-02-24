import React from 'react';
import { Text, View } from 'react-native';

let MapView: any;
let Marker: any;
let mapsAvailable = false;

try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    mapsAvailable = true;
} catch {
    // react-native-maps not available (e.g. web or missing native module)
}

export const Map = (props: any) => {
    if (!mapsAvailable || !MapView) {
        return (
            <View
                style={[
                    { backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
                    props.style,
                ]}
            >
                <Text style={{ color: '#6b7280', fontSize: 14 }}>
                    📍 Map view not available
                </Text>
            </View>
        );
    }

    return (
        <MapView {...props}>
            {props.children}
        </MapView>
    );
};

export const MapMarker = mapsAvailable && Marker ? Marker : (props: any) => null;
