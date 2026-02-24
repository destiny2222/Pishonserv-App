import React from 'react';
import { Text, View } from 'react-native';

export const Map = (props: any) => {
    return (
        <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }, props.style]}>
            <Text>Map preview is not available on web</Text>
        </View>
    );
};

export const MapMarker = (props: any) => null;
